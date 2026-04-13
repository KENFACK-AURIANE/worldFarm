import ReactDOM from "react-dom/client";

let container: HTMLDivElement | null = null;

export const showToastLogin = (message: string) => {
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
        top: "20px",
        right: "20px",
        background: "black",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );

  root.render(<Toast />);

  // disparition auto
  setTimeout(() => {
    root.unmount();
  }, 3000);
};