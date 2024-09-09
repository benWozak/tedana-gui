import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

const ThemeToggle = () => {
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const [theme, setTheme] = useState("system");
  const [systemTheme, setSystemTheme] = useState("emerald");

  useEffect(() => {
    const initTheme = async () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
      try {
        const currentSystemTheme: any = await invoke("get_system_theme");
        setSystemTheme(currentSystemTheme);
      } catch (error) {
        console.error("Failed to get system theme:", error);
      }
    };

    initTheme();

    const unlistenThemeChange = listen("system-theme-change", (event) => {
      const newSystemTheme = event.payload as string;
      setSystemTheme(newSystemTheme);
      if (theme === "system") {
        applyTheme(newSystemTheme);
      }
    });

    return () => {
      unlistenThemeChange.then((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    applyTheme(theme === "system" ? systemTheme : theme);
    localStorage.setItem("theme", theme);
  }, [theme, systemTheme]);

  const applyTheme = (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (dropdownRef.current) {
      dropdownRef.current.removeAttribute("open");
    }
  };

  return (
    <details ref={dropdownRef} className="dropdown dropdown-end">
      <summary className="btn-circle w-20">
        {theme === "system" ? (
          <Monitor size={20} />
        ) : theme === "emerald" ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}
      </summary>
      <ul className="mt-3 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 z-[1]">
        <li>
          <a
            onClick={() => handleThemeChange("emerald")}
            className={theme === "emerald" ? "active" : ""}
          >
            <Sun size={16} /> Light
          </a>
        </li>
        <li>
          <a
            onClick={() => handleThemeChange("dim")}
            className={theme === "dim" ? "active" : ""}
          >
            <Moon size={16} /> Dark
          </a>
        </li>
        <li>
          <a
            onClick={() => handleThemeChange("system")}
            className={theme === "system" ? "active" : ""}
          >
            <Monitor size={16} /> System
          </a>
        </li>
      </ul>
    </details>
  );
};

export default ThemeToggle;
