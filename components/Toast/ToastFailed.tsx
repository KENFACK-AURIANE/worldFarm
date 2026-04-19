import { X } from "lucide-react";
import ReactDOM from "react-dom/client";

let container: HTMLDivElement | null = null;

export const showToastFailed = (message: string) => {
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
        background: "red",
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
        <X className="fill-white stroke-red-500"/>
      {message}
    </div>
  );

  root.render(<Toast />);

  // disparition auto
  setTimeout(() => {
    root.unmount();
  }, 3000);
};