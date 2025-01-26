import { lazy, Suspense, createRoot } from "@wordpress/element";
import { GlobalStateProvider } from "./state";
const LinearProgress = MaterialUI.LinearProgress;

const EmbedForm = lazy(() => import("./components/EmbedForm"));
const ConversationalForm = lazy(
  () => import("./components/ConversationalForm"),
);

document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("phoenix-form-root");
  if (chat) {
    const root = createRoot(chat);
    root.render(
      <GlobalStateProvider>
        <Suspense fallback={<LinearProgress />}>
          <ConversationalForm />
        </Suspense>
      </GlobalStateProvider>,
    );
  }

  const roots = document.querySelectorAll(".phoenix-form-embed-root");
  roots.forEach((el) => {
    createRoot(el).render(
      <Suspense fallback={<LinearProgress />}>
        <EmbedForm />
      </Suspense>,
    );
  });
});
