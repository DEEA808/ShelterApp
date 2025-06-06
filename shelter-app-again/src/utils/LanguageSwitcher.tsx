import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div style={{ display: "flex", gap: "10px",fontSize:"12px"}}>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      <button onClick={() => i18n.changeLanguage('ro')}>RO</button>
    </div>
  );
};

export default LanguageSwitcher;
