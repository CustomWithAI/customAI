# CustomAI Platform

## Overview
The **CustomAI Website** is a no-code platform designed to enable users to create, train, and deploy custom AI models without any coding knowledge. The platform provides an intuitive interface, allowing users to upload datasets, configure model parameters, and deploy trained models for real-world applications. This project is ideal for medical professionals, researchers, and others looking to leverage AI without technical expertise.

## Features
- **No-Code Model Creation**: Create machine learning models through an easy-to-use interface.
- **Dataset Upload**: Upload images (e.g., X-ray, ultrasound) or other types of data for training models.
- **Automated Training Process**: Configure model settings and initiate training with a few clicks.
- **Real-Time Model Deployment**: Deploy trained models to production environments for immediate use.
- **User-Friendly UI**: Simple and efficient user interface for seamless interaction.

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/CustomAI.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd CustomAI
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Install Git Policy**:
   ```bash
   bun prepare
   ```

## Getting Started
1. **Set up the environment**: Copy the `.env.example` to `.env` and configure the necessary variables.
2. **Run the application**:
   ```bash
   bun run dev
   ```
   or
   **using docker** (Recommend):
   ```bash
   docker compose up -d
   ```
3. **Set up localstack in dev mode**:
   ```bash
   aws configure --profile default
   ```
   (enter variable in configuration)
   ```bash
   AWS Access Key ID [None]: test
   AWS Secret Access Key [None]: test
   Default region name [None]: us-east-1
   Default output format [None]: json
   ```
   3a. ***create bucket***:
      ```bash
      aws s3 mb s3://my-bucket --endpoint-url http://localhost:4566
      ```
   3b. ***list bucket***:
      ```bash
      aws s3 ls --endpoint-url=localhost:4566 --recursive --human-readable
      ```
5. 
6. **Access the application**: Open a browser and go to `http://localhost:3000`.
7. **Access Docs on backend**: Open a browser and go to `http://localhost:4000/docs`

## Configuration
### Environment Variables
- **NEXT_PUBLIC_SERVER_BACKEND_URL**: Backend server URL for data processing.
- **AUTH_SECRET**: Secret key for authentication.
- [Add any other relevant variables here]

### Backend and Database
- Ensure the backend server and database are correctly configured. See the [Backend Setup](docs/backend.md) or `https://localhost:4000/docs` for more details.

## Usage
1. **Login or Register**: Create an account to access the model creation features.
2. **Upload Dataset**: Upload data files to begin training.
3. **Model Configuration**: Customize model settings based on your specific use case.
4. **Train the Model**: Start the training process with a single click.
5. **Deploy the Model**: Deploy the model to make predictions on new data.

### Sample Workflow
- Step-by-step walkthrough to create and deploy a sample model.

## Tech Stack

**Client:** React, NextJS, TailwindCSS

**Server:** Bun, Elysia

**AI:** Python FastAPI

## Project Structure
frontend
```
📁 src
├── 📁 components          # Reusable UI components
│   ├── 📁 common          # Generic components used across the app
│   ├── 📁 layout          # Layout components (e.g., Header, Footer)
│   └── 📁 specific        # Specific components for particular pages/features
│
├── 📁 features            # Custom group of components
├── 📁 hooks               # Custom React hooks
│   ├── 📁 queries         # 'get' API hooks
│   └── 📁 mutations       # 'post' 'put' 'patch' 'delete' API hooks
│
├── 📁 context             # React context providers for state management
├── 📁 utils               # Utility functions
├── 📁 services            # API calls and services
├── 📁 types               # TypeScript types and interfaces
│   ├── 📁 common          # Generic types used across the app
│   └── 📁 specific        # Specific types for particular pages/features
│
├── 📁 public              # Static assets
│   ├── images             # Images used in the project
│   └── fonts              # Custom fonts
|
├── 📁 locale              # translation locale
|
└── 📁 tests               # Tests and test utilities
    ├── components         # Component tests
    ├── hooks              # Hook tests
    └── utils              # Utility tests

```
backend
```
📁 src
├── 📁 application
│   ├── 📁 routes            # contain group routes
│   ├── 📁 repositories      # Repository controls database system 
│   ├── 📁 services          # Services or Domain services (business rules not bound to a use case)
│   └── 📁 controllers       # Controllers controls group of services
│
├── 📁 domain
│   ├── 📁 models            # Core entities/models representing domain concepts
│   ├── 📁 interface         # Repository interfaces (e.g., IUserRepository)
│   └── 📁 schema            # drizzle schema interfaces
│
├── 📁 config                # Configuration files (e.g., .env, configuration modules)
│
├── 📁 infrastructure      
│   ├── 📁 database          # Database setup and ORM entities
│   ├── 📁 redis             # Redis setup
│   └── 📁 rabbitmq          # Rabbitmq setup
│
├── 📁 interfaces
│   ├── 📁 controllers       # Interface adapters for external interfaces (HTTP, gRPC, etc.)
│   └── 📁 presenters        # Formatting and transforming data responses
│
├── 📁 middleware            # middleware guard (e.g. auth middleware )
│
└── 📁 utils                 # Utility functions (helpers, formatters, validators)
```
python
```
```

## Contributing
We welcome contributions! Please see the [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## License
This project is licensed under the [MIT License](LICENSE).

---

This outline can be expanded with further documentation, screenshots, and links to any resources needed by users or contributors.
