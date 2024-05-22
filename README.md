# YOLO Training GUI

- This project provides a web interface for training and evaluating YOLO models on UAV (Unmanned Aerial Vehicle) videos. 

- It is designed for target detection model training and evaluation. 

- The project consists of a React frontend and a Flask backend. 

- The project includes endpoints for downloading datasets, training YOLO v8 and YOLO v9 models, and evaluating YOLO v8 models.

## Table of Contents

- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Dataset Information](#dataset-information)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js (version 21)
- Python 3.x
- pip (Python package installer)

### Clone the Repository

    git clone https://github.com/your-repo/yolo-training-gui.git
    cd yolo-training-gui

### Setup

This project includes a setup script to install all dependencies and start the backend and frontend services.

1. Ensure the `setup.sh` script has execute permissions:

        chmod +x setup.sh

2. Run the setup script:

        ./setup.sh

The `setup.sh` script performs the following actions:

- Checks and installs Python and pip
- Installs backend dependencies
- Starts the backend Flask server
- Checks and installs Node.js and npm
- Installs frontend dependencies
- Starts the frontend React application

## Running the Project

If you prefer to run the backend and frontend services manually, follow the instructions below.

### Running the Backend

1. Navigate to the `backend` directory:

        cd backend

2. Install backend dependencies:

        pip install -r requirements.txt

3. Start the Flask server:

        python app.py

### Running the Frontend

1. Navigate to the `frontend` directory:

        cd ../frontend

2. Install frontend dependencies:

        npm install

3. Start the React application:

        npm start


## Usage

Once both the backend and frontend are running, you can access the web interface by navigating to `http://localhost:3000` in your web browser. 

## Dataset Information

The dataset used for training and evaluation is available at [Roboflow](https://app.roboflow.com/uavdetection-y3q13/uav_207_small_vehicle/4).

### Classes

The dataset includes the following classes.

- **bicycle**
- **bus**
- **car**
- **human**
- **motorbike**
- **truck**

### Training and Validation Sets

- **Training Set**: Combination of VisDrone and 207 video.
- **Validation Set**: 212 video.

## API Endpoints

### Download Dataset

- **URL**: `/download-dataset`
- **Method**: `GET`
- **Description**: Downloads the dataset for YOLO training.

### Train YOLO v8

- **URL**: `/train-yolo-v8`
- **Method**: `POST`
- **Description**: Starts training the YOLO v8 model.

### Train YOLO v9

- **URL**: `/train-yolo-v9`
- **Method**: `POST`
- **Description**: Starts training the YOLO v9 model.

### Evaluate YOLO v8

- **URL**: `/evaluate-yolo-v8`
- **Method**: `POST`
- **Description**: Evaluates the YOLO v8 model.

### Evaluate YOLO v9

- **URL**: `/evaluate-yolo-v9`
- **Method**: `POST`
- **Description**: Evaluates the YOLO v9 model.

## Project Structure

    yolo-project/
    ├── backend/
    │   ├── models/
    │   │   ├── yolo_v8
    │   │   ├── yolo_v9
    │   ├── runs/
    │   │   ├── detect/
    │   ├── uav_207_small_vehicle-4/
    │   ├── app.py
    │   ├── nohup.out
    │   ├── requirements.txt
    ├── frontend/
    │   ├── node_modules/
    │   ├── public/
    │   │   ├── index.html
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── SystemInfo.js
    │   │   ├── services/
    │   │   │   ├── ApiService.js
    │   │   ├── ApiService.js
    │   │   ├── App.css
    │   │   ├── App.js
    │   │   ├── index.css
    │   │   ├── index.js
    │   ├── package-lock.json
    │   ├── package.json
    ├── README.md
    ├── setup.sh

## Contributing

Contributions are welcome! Please open issues and submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
