FROM nginx:alpine

# Copy the standalone HTML file
COPY standalone_preview.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
