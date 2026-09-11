import "./(site)/site.css";
import Link from "next/link";
import { Header } from "@/components/site/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="not-found">
        <div>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            Error 404
          </div>
          <h1 className="display">
            Esta flor
            <br />
            <span className="accent">no está aquí.</span>
          </h1>
          <p>La página que buscas no existe o ya no está disponible. Quizá la encuentres en la tienda.</p>
          <div className="hero__actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn--solid" href="/tienda">
              Ir a la tienda
            </Link>
            <Link className="btn btn--ghost" href="/">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
