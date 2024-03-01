import "./App.css";
import AllRoutes from "./router/AllRoutes";
import { AuthProvider } from "./utils/auth";

function App() {
  return (
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  );
}

export default App;
