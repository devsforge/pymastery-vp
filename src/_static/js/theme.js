// theme variables
const themeAttribute = "data-theme"
const theme = {
    light: "light",
    dark: "dark",
}
const userTheme = localStorage.getItem(themeAttribute)
const isSystemThemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches


// initial theme check
const checkTheme = () => {
    if (userTheme === theme.dark || (!userTheme && isSystemThemeDark)) {
        document.documentElement.setAttribute(themeAttribute, theme.dark)
    } else document.documentElement.setAttribute(themeAttribute, theme.light)
}


// manual theme select
const swapTheme = () => {
    const currentTheme = document.documentElement.getAttribute(themeAttribute)
    const themeValue = currentTheme === theme.light ? theme.dark : theme.light
    localStorage.setItem(themeAttribute, themeValue)
    document.documentElement.setAttribute(themeAttribute, themeValue)
}


const swapThemeBtn = document.getElementById("swap-theme-btn");
if (swapThemeBtn) swapThemeBtn.addEventListener("click", swapTheme)

document.addEventListener("DOMContentLoaded", () => {
    checkTheme()
})
