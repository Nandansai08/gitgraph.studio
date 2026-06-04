# GitGraph Studio: Azure Infrastructure Documentation

This document describes the Azure infrastructure architecture and setups for running GitGraph Studio in production.

## Infrastructure Diagram

```
[User Browser] === HTTPS ===> [Azure App Service (Linux Web App)]
                                     ||             ||
                                 Database       Monitoring
                                     ||             ||
                                     \/             \/
                   [Azure Database for PostgreSQL]  [Azure Application Insights]
```

---

## 1. Azure App Service

The application runs directly on a Linux-based **Azure App Service** instance.

### App Service Configuration:
- **Stack**: Node.js 18 LTS (or 20 LTS).
- **Startup Command**: `npx next start -p 8080` (or leave blank to let Next.js use standard port settings mapping).
- **Scaling**: A Basic (B1) or Standard (S1) App Service plan is sufficient for standard loads. Configure autoscale rules based on CPU and memory limits.

---

## 2. Azure Database for PostgreSQL Flexible Server

Data persistence is managed via **Azure Database for PostgreSQL Flexible Server**.

### Configuration Rules:
- **Server Version**: PostgreSQL 14 or higher.
- **Compute tier**: Burstable (e.g. `Standard_B1ms`) is cost-effective for dev/staging, while General Purpose is recommended for production traffic.
- **SSL Connection**: Enforce SSL connections (`sslmode=require`) in the connection string for security.
- **Networking/Firewall**: Enable "Allow public access from any Azure service within Azure to this server" so the App Service can establish database tunnels.

---

## 3. Azure Application Insights

GitGraph Studio is integrated with **Azure Application Insights** for comprehensive monitoring.

### Setup Instructions:
1. Create an Application Insights resource in the Azure Portal.
2. Retrieve the connection string.
3. Configure the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable in the App Service settings.
4. Monitoring logs tracks server response latency, API route failure rates, SQL query execution speeds (via Prisma logs), and exception stack traces.

---

## 4. Azure Blob Storage Configuration

Although file/image uploads are not actively utilized in the application today, the following App Settings are defined to support future enhancements:
- `AZURE_STORAGE_ACCOUNT_NAME`: Storage account identifier.
- `AZURE_STORAGE_ACCOUNT_KEY`: Secret access key.
- `AZURE_STORAGE_CONTAINER`: Target container name.

---

## 5. Deployment Configurations

Set all required credentials (from [.env.example](file:///c:/Users/nanda/gitgraph.studio/.env.example)) under the **Settings -> Configuration -> Application settings** panel in the Azure Portal. Values defined there will be injected securely at runtime.
