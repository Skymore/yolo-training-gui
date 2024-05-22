import os
import re
import glob
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import psutil
import GPUtil
from ultralytics import YOLO
from roboflow import Roboflow

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

def get_latest_model_path(model_name):
    model_dirs = sorted(glob.glob(f'runs/train/{model_name}*'), key=os.path.getmtime, reverse=True)
    if model_dirs:
        latest_model_dir = model_dirs[0]
        return os.path.join(latest_model_dir, 'weights', 'last.pt')
    return None

@app.route('/download-dataset', methods=['GET'])
def download_dataset():
    rf = Roboflow(api_key="QVtZUXi4WP2AaYij3ecV")
    project = rf.workspace("uavdetection-y3q13").project("uav_207_small_vehicle")
    version = project.version(4)
    current_directory = os.getcwd()
    dataset = version.download("yolov8", location=current_directory)
    return jsonify({"message": "Dataset downloaded successfully"})

def send_log(log_message):
    socketio.emit('log', {'data': log_message})

def send_progress(progress):
    socketio.emit('progress', {'progress': progress})

def train_model(model, data_path, epochs, imgsz, device, batch, name):
    for line in model.train(data=data_path, epochs=epochs, imgsz=imgsz, device=device, batch=batch, name=name):
        send_log(line)
        # Extract progress information from the log line
        match = re.search(r'(\d+)%\|', line)
        if match:
            progress = int(match.group(1))
            send_progress(progress)

@app.route('/train-yolo-v8', methods=['POST'])
def train_yolo_v8():
    data = request.json
    devices = data.get('devices', ['0'])
    batch = data.get('batch', -1)
    device = 'cpu' if 'cpu' in devices else ','.join(devices)
    model = YOLO("yolov8x.pt")
    current_directory = os.getcwd()
    data_path = os.path.join(current_directory, "uav_207_small_vehicle-4", "data.yaml")
    name = f'yolov8_{len(glob.glob("runs/train/yolov8*")) + 1}'
    train_model(model, data_path, 100, 640, device, batch, name)
    return jsonify({"message": "YOLO v8 training completed"})

@app.route('/train-yolo-v9', methods=['POST'])
def train_yolo_v9():
    data = request.json
    devices = data.get('devices', ['0'])
    batch = data.get('batch', -1)
    device = 'cpu' if 'cpu' in devices else ','.join(devices)
    model = YOLO("yolov9e.pt")
    current_directory = os.getcwd()
    data_path = os.path.join(current_directory, "uav_207_small_vehicle-4", "data.yaml")
    name = f'yolov9_{len(glob.glob("runs/train/yolov9*")) + 1}'
    train_model(model, data_path, 100, 640, device, batch, name)
    return jsonify({"message": "YOLO v9 training completed"})

@app.route('/evaluate-yolo-v8', methods=['POST'])
def evaluate_yolo_v8():
    data = request.json
    devices = data.get('devices', ['0'])
    device = 'cpu' if 'cpu' in devices else ','.join(devices)
    latest_model_path = get_latest_model_path('yolov8')
    if not latest_model_path:
        return jsonify({"message": "No YOLO v8 model found for evaluation"}), 404
    model = YOLO(latest_model_path)
    current_directory = os.getcwd()
    data_path = os.path.join(current_directory, "uav_207_small_vehicle-4", "data.yaml")
    results = model.val(data=data_path, device=device)
    return jsonify({"message": "YOLO v8 evaluation completed", "results": results})

@app.route('/evaluate-yolo-v9', methods=['POST'])
def evaluate_yolo_v9():
    data = request.json
    devices = data.get('devices', ['0'])
    device = 'cpu' if 'cpu' in devices else ','.join(devices)
    latest_model_path = get_latest_model_path('yolov9')
    if not latest_model_path:
        return jsonify({"message": "No YOLO v9 model found for evaluation"}), 404
    model = YOLO(latest_model_path)
    current_directory = os.getcwd()
    data_path = os.path.join(current_directory, "uav_207_small_vehicle-4", "data.yaml")
    results = model.val(data=data_path, device=device)
    return jsonify({"message": "YOLO v9 evaluation completed", "results": results})

@app.route('/evaluate-yolo-v8-best', methods=['POST'])
def evaluate_yolo_v8_best():
    data = request.json
    devices = data.get('devices', ['0'])
    device = 'cpu' if 'cpu' in devices else ','.join(devices)
    current_directory = os.getcwd()
    model_path = os.path.join(current_directory, "models", "yolo_v8", "train", "weights", "best.pt")
    data_path = os.path.join(current_directory, "uav_207_small_vehicle-4", "data.yaml")
    model = YOLO(model_path)
    results = model.val(data=data_path, device=device)
    return jsonify({"message": "YOLO v8 best model evaluation completed", "results": results})

@app.route('/evaluate-yolo-v9-best', methods=['POST'])
def evaluate_yolo_v9_best():
    data = request.json
    devices = data.get('devices', ['0'])
    device = 'cpu' if 'cpu' in devices else ','.join(devices)
    current_directory = os.getcwd()
    model_path = os.path.join(current_directory, "models", "yolo_v9", "train", "weights", "best.pt")
    data_path = os.path.join(current_directory, "uav_207_small_vehicle-4", "data.yaml")
    model = YOLO(model_path)
    results = model.val(data=data_path, device=device)
    return jsonify({"message": "YOLO v9 best model evaluation completed", "results": results})

@app.route('/system-info', methods=['GET'])
def system_info():
    cpu_info = {
        "physical_cores": psutil.cpu_count(logical=False),
        "total_cores": psutil.cpu_count(logical=True),
        "frequency": psutil.cpu_freq()._asdict(),
        "usage": [psutil.cpu_percent(interval=1, percpu=True)]
    }
    gpus = GPUtil.getGPUs()
    gpu_info = []
    for gpu in gpus:
        gpu_info.append({
            "id": gpu.id,
            "name": gpu.name,
            "load": gpu.load * 100,
            "memory_free": gpu.memoryFree,
            "memory_used": gpu.memoryUsed,
            "memory_total": gpu.memoryTotal,
            "temperature": gpu.temperature
        })
    return jsonify({"cpu": cpu_info, "gpus": gpu_info})

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
