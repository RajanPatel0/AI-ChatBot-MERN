import app from "./app.js";
import { connectToDatabase } from "./db/connnection.js";
//connections & listeners
const PORT = process.env.PORT;
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => console.log("Server Open & Connected to Database!"));
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map