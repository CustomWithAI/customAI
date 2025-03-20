import type { Config } from "tailwindcss";

const config = {
	content: [
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			maskImage: {
				"radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				shine: {
					"0%": { backgroundPosition: "200% 0" },
					"25%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "-200% 0" },
				},
				gradientFlow: {
					"0%": { "background-position": "0% 50%" },
					"50%": { "background-position": "100% 50%" },
					"100%": { "background-position": "0% 50%" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				shine: "shine 3s ease-out infinite",
				"gradient-flow":
					"gradientFlow 10s ease 0s infinite normal none running",
			},
			colors: {
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					accent: "hsl(var(--sidebar-accent))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted-background))",
					foreground: "hsl(var(--muted-foreground))",
				},
			},
		},
	},
	plugins: [],
} satisfies Config;

export default config;
