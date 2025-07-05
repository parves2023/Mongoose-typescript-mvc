import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path:path.join(process.cwd(), ".env")})

// export default {
//     node_env:process.env.NODE_ENV,
//     port:process.env.PORT,
//     database_url:process.env.DATABASE_URL,
// }

export default {
  node_env: "development",
  port: 5000,
  database_url: "mongodb+srv://parves32:O6AcxyBUJwPSvda7@cluster0.3tilc.mongodb.net/libraryManagement?retryWrites=true&w=majority&appName=Cluster0",
};
