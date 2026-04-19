import { CheckCircle } from "lucide-react";
import ReactDOM from "react-dom/client";

let container: HTMLDivElement | null = null;

export const showToastSuccess = (message: string) => {
  // créer le container une seule fois
  if (!container) {
    container = document.createElement("div");
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);

  const Toast = () => (
    <div
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        background: "green",
        color: "white",
        padding: "10px 20px",
        borderRadius: "20px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexDirection: "row",
      }}
    >
        <CheckCircle className="fill-white stroke-green-500"/>
      {message}
    </div>
  );

  root.render(<Toast />);

  // disparition auto
  setTimeout(() => {
    root.unmount();
  }, 3000);
};