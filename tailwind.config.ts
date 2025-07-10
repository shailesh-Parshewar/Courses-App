import type { Config } from "tailwindcss"

export default {
    content : [
        "./src/pages/**/*.{js,ts,tsx,jsx,mdx}",
        "./src/app/**/*.{js,ts,tsx,jsx,mdx}",
        "./src/components/**/*.{js,ts,tsx,jsx,mdx}",
    ],
    theme : {
        container : {
  center : true,
  padding: "2rem",
  screens : {
    sm : "1500px"
  }
        },
        extend : {
            colors : {
                background : "var(--background)",
                foreground : "var(--foreground)",
            }
        }
    },
    plugins : [],
} satisfies Config;

