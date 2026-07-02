"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Btn } from "./Btn";

type VideoType = "video" | "shorts";

interface PopupApi {
  openVideo: (hash: string, type?: VideoType) => void;
  openCallback: () => void;
  openSuccess: () => void;
  closeAll: () => void;
}

const PopupContext = createContext<PopupApi | null>(null);

export function usePopups(): PopupApi {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopups must be used inside <PopupProvider>");
  return ctx;
}

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [video, setVideo] = useState<{ hash: string; type: VideoType } | null>(null);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const openVideo = useCallback((hash: string, type: VideoType = "video") => setVideo({ hash, type }), []);
  const openCallback = useCallback(() => setCallbackOpen(true), []);
  const openSuccess = useCallback(() => {
    setCallbackOpen(false);
    setSuccessOpen(true);
  }, []);
  const closeAll = useCallback(() => {
    setVideo(null);
    setCallbackOpen(false);
    setSuccessOpen(false);
  }, []);

  return (
    <PopupContext.Provider value={{ openVideo, openCallback, openSuccess, closeAll }}>
      {children}

      {/* popup-video */}
      <div className={`popup popup-video${video ? " active" : ""}`} data-popup-name="video">
        <div className="back-close" onClick={closeAll} />
        <div className="popup-content flex-v">
          <button className="form-close flex icon-close" aria-label="Закрити" onClick={closeAll} />
          <div className={`video-player${video?.type === "shorts" ? " shorts" : ""}`}>
            {video && (
              <iframe
                src={`https://www.youtube.com/embed/${video.hash}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
              />
            )}
          </div>
        </div>
      </div>

      {/* popup-callback */}
      <div className={`popup popup-callback${callbackOpen ? " active" : ""}`} data-popup-name="callback">
        <div className="back-close" onClick={closeAll} />
        <div className="popup-content flex-v">
          <button className="form-close flex icon-close" aria-label="Закрити" onClick={closeAll} />
          <h2 className="title mulish-32">Залиште свої контактні дані</h2>
          <p className="subtitle">Наш менеджер зв’яжеться з Вами.</p>
          <div className="custom-form">
            <ContactForm onSuccess={openSuccess} />
          </div>
        </div>
      </div>

      {/* popup-success */}
      <div className={`popup popup-success${successOpen ? " active" : ""}`} data-popup-name="success">
        <div className="back-close" onClick={closeAll} />
        <div className="popup-content flex-v">
          <button className="form-close flex icon-close" aria-label="Закрити" onClick={closeAll} />
          <div className="icon" />
          <h2 className="title mulish-32">Запит успішно надісланий</h2>
          <Btn label="Повернутись на головну" className="cta" onClick={closeAll} ariaLabel="Повернутись на головну" />
        </div>
      </div>
    </PopupContext.Provider>
  );
}

/** Mirrors the CF7 markup: name + phone inputs, letter-animated submit. Demo-only submit. */
export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");

  return (
    <form
      className="wpcf7-form init"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !tel.trim()) return;
        setName("");
        setTel("");
        onSuccess?.();
      }}
    >
      <label>
        <span className="wpcf7-form-control-wrap" data-name="user_name">
          <input
            size={40}
            maxLength={40}
            className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
            aria-required="true"
            required
            placeholder="Ім'я*"
            type="text"
            name="user_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </span>
      </label>
      <label>
        <span className="wpcf7-form-control-wrap" data-name="user_tel">
          <input
            size={40}
            maxLength={40}
            className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel"
            aria-required="true"
            required
            placeholder="XXX XXX"
            type="tel"
            name="user_tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
        </span>
      </label>
      <Btn label="Отримати консультацію" className="submit" type="submit" ariaLabel="Отримати консультацію" />
    </form>
  );
}
