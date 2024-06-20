FROM node:18

# Create a non-root user
RUN useradd -ms /bin/bash appuser

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory inside the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory inside the container
COPY . .

# Change ownership of the working directory to the non-root user
RUN chown -R appuser /app

# Switch to the non-root user
USER appuser

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]