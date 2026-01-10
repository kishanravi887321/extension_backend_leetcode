import app from "./app.js";
import connectDB from "./db/main.db.js";


const startServer =async ()=>{
    await connectDB();
    app.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
}

startServer();
