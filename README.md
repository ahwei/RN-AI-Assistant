# RN AI Assistant

 Product Overview

This project is a **multi-expert AI chat platform** that empowers users to interact with a panel of virtual experts, each offering unique perspectives and insights. It bridges cutting-edge AI capabilities with a seamless user experience, creating an innovative tool for dynamic, knowledge-driven conversations.

## Key Features

### 1. Expert Panel Conversations
- Engage in real-time discussions with a curated set of AI-driven experts, each simulating a distinct personality and area of expertise.
- Experts provide contextually aware responses, maintaining the continuity of the conversation.

### 2. Consensus Answer
- Receive a summarized consensus generated from the responses of multiple experts, helping users distill complex discussions into clear takeaways.

### 3. Dynamic and Personalized Experiences
- Experts can be customized with specific personas and styles of speech to align with user preferences or use cases.
- Enables scenario-based or role-playing interactions for diverse applications.

### 4. Responsive User Interface
- Built using React Native, the platform provides an intuitive, mobile-first experience that adapts to various devices.
- Designed for quick onboarding and effortless interaction.

### 5. Reliable Backend
- A Python FastAPI-powered backend ensures fast and efficient processing of chat data.
- Real-time streaming of responses simulates human-like conversational flows, enhancing user engagement.

## Use Cases

### Education & Learning
- Interact with experts in fields such as science, technology, health, or philosophy to gain diverse perspectives.
- A perfect companion for students, researchers, or lifelong learners.

### Professional Advice
- Use the platform to simulate expert advice for industries like finance, engineering, or project management.

### Entertainment & Role-Playing
- Chat with AI versions of popular personalities for fun, engaging conversations.
- Simulate interviews or panel discussions.

### Customer Support & FAQ
- Extend the platform into businesses for automated, multi-faceted customer interactions.

## Vision

The platform aims to democratize access to expert knowledge by combining the power of AI with an accessible and engaging interface. By enabling multi-perspective conversations and offering tailored expert personas, it reimagines how users learn, collaborate, and explore ideas in a digital environment.

## Future Development

- Expand the range of expert personas with additional fields of expertise and finer personality tuning.
- Introduce multilingual support for global accessibility.
- Integrate with more robust AI APIs to enhance response accuracy and depth.
- Develop analytics features to track and improve the quality of expert responses and consensus generation.

This product represents a step forward in how we engage with AI-driven knowledge systems, making expert insights accessible anytime, anywhere.
<img src="images/home.png" alt="image1" width="300"/>

## Development Environment Requirements

- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- Make

## Setting Up the Environment

### React Native

1. Ensure you have Node.js 18+ installed. You can download it from [Node.js official website](https://nodejs.org/).
2. Install Expo CLI globally:
   ```sh
   npm install -g expo-cli
   ```
3. Navigate to the project directory and install dependencies:
   ```sh
   make rn-install
   ```
4. Copy the example environment file:
   ```sh
   cp my-app/.env.example my-app/.env
   ```
5. Start the React Native development server:
   ```sh
   make rn-start
   ```
6. To run the app on an Android emulator:
   ```sh
   make rn-android
   ```
7. To run the app on an iOS simulator:
   ```sh
   make rn-ios
   ```
8. To clean the React Native project:
   ```sh
   make rn-clean
   ```

### Python (Docker)

1. Ensure you have Docker and Docker Compose installed. You can download them from [Docker official website](https://www.docker.com/).
2. Navigate to the project directory and build the Docker images:
   ```sh
   make build
   ```
3. Copy the example environment file:
   ```sh
   cp backend/.env.example backend/.env
   ```
4. Start the backend services:
   ```sh
   make up
   ```
5. To stop the backend services:
   ```sh
   make down
   ```

## Quick Start

<img src="images/ask_question.png" alt="image2" width="300"/>

### Frontend (React Native)

```sh
make rn-install    # Install React Native dependencies
make rn-start      # Start React Native development server
make rn-android    # Run on Android emulator
make rn-ios        # Run on iOS simulator
make rn-clean      # Clean React Native project
```

### Backend (Python)

```sh
make build         # Build Docker images
make up            # Start backend services
make down          # Stop backend services
make logs          # View backend logs
```
