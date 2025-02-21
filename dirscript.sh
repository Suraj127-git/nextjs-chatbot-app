#!/bin/bash
# Create src directory structure
mkdir -p src/{components,lib,modules,pages,services,utils}

# Create styles
mkdir -p styles
touch styles/globals.css

# Create components
touch src/components/ChatBox.tsx
touch src/components/KnowledgeBase.tsx

# Create lib
touch src/lib/config.ts

# Create modules subdirectories and files
mkdir -p src/modules/{chat,knowledgeBase}
touch src/modules/chat/ChatComponent.tsx
touch src/modules/chat/chatService.ts
touch src/modules/knowledgeBase/KnowledgeComponent.tsx
touch src/modules/knowledgeBase/kbService.ts

# Create pages structure
mkdir -p src/pages/api
touch src/pages/api/chat.ts
touch src/pages/api/scrape.ts
touch src/pages/index.tsx

# Create services
touch src/services/llmService.ts
touch src/services/qdrantService.ts
touch src/services/scraperService.ts

# Create utils
touch src/utils/helpers.ts

echo "Directory structure created successfully!"