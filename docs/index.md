# Configurable Backend Engine

A powerful Low/No Code Tool to build Backend Rest APIs by using visual building blocks. Create complex API endpoints through an intuitive drag-and-drop interface without writing extensive code.

## 🚀 Features

- **Visual API Builder**: Design APIs using drag-and-drop blocks
- **No Code Required**: Build complex logic without programming knowledge
- **Extensible Architecture**: Add custom blocks for specialized functionality
- **Real-time Execution**: See your API changes instantly
- **Type Safety**: Built with TypeScript for reliability
- **Database Integration**: Seamless ORM integration with Drizzle
- **Transaction Support**: Atomic operations for data consistency

## 📋 Table of Contents

- [Getting Started](./getting-started/installation.md)
- [Blocks](./blocks/index.md)
  - [Built-in Blocks](./blocks/index.md#built-in-blocks)
  - [Custom Blocks](./blocks/index.md#custom-blocks)
- [Concepts](./concepts/context.md)
- [API Reference](./concepts/context.md#api-reference)

## 🏗️ Architecture

The Configurable Backend Engine consists of several key components:

### Core Components

- **Block Engine**: Executes the visual workflow defined by blocks
- **Admin API**: RESTful API for managing routes, blocks, and edges
- **UI Editor**: Web-based visual editor for designing APIs
- **Database Layer**: PostgreSQL with Drizzle ORM for data persistence

### Block System

Blocks are the fundamental building units that define API behavior:

- **Entrypoint Block**: Entry point for all API requests
- **Processing Blocks**: Transform, validate, and manipulate data
- **Control Flow Blocks**: Conditional logic and loops
- **HTTP Blocks**: Handle request/response operations
- **Response Block**: Final output generation

## 🎯 Use Cases

- **Rapid Prototyping**: Quickly build and test API endpoints
- **Business Logic Automation**: Implement complex workflows visually
- **Data Processing Pipelines**: Create ETL processes without code
- **API Orchestration**: Combine multiple services and data sources
- **Webhook Processing**: Handle and transform webhook payloads

## 🛠️ Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Editor**
   Navigate to `http://localhost:3000` to start building your APIs

4. **Create Your First Route**
   - Use the visual editor to drag and drop blocks
   - Connect blocks to define your API logic
   - Test your endpoint instantly

## 📚 Documentation

This documentation covers:

- **Block Reference**: Complete guide to all available blocks
- **API Documentation**: RESTful endpoints for programmatic access
- **Configuration**: Environment setup and customization
- **Extensibility**: How to create custom blocks
- **Best Practices**: Performance and security guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Adding new blocks
- Improving documentation
- Reporting bugs
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
