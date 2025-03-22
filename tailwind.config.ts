
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for our smart city app
				"city-blue": {
					50: "#E6F5FF",
					100: "#CCE8FF",
					200: "#99C7FF",
					300: "#66A6FF",
					400: "#3385FF",
					500: "#0064FF",
					600: "#0052D6",
					700: "#003FAD",
					800: "#002D85",
					900: "#001A5C",
				},
				"city-teal": {
					50: "#E6FFFB",
					100: "#B3FFF4",
					200: "#80FFEE",
					300: "#4DF7E5",
					400: "#26E3D6",
					500: "#0BC9C0",
					600: "#09A6A0",
					700: "#078380",
					800: "#056160",
					900: "#033F3E",
				},
				"city-green": {
					50: "#E8FFF3",
					100: "#D1FFE7",
					200: "#A3FFD0",
					300: "#76FFB8",
					400: "#48FFA1",
					500: "#1BFF8A",
					600: "#00E673",
					700: "#00B359",
					800: "#008040",
					900: "#004D26",
				},
				"city-amber": {
					50: "#FFF8E6",
					100: "#FFEFC0",
					200: "#FFE080",
					300: "#FFD040",
					400: "#FFC000",
					500: "#E0A800",
					600: "#C09000",
					700: "#A07800",
					800: "#806000",
					900: "#604800",
				},
				"city-red": {
					50: "#FFF1F0",
					100: "#FFE2E0",
					200: "#FFC5C1",
					300: "#FFA8A3",
					400: "#FF8B84",
					500: "#FF6E65",
					600: "#FF5146",
					700: "#FF3427",
					800: "#FF1708",
					900: "#E50D00",
				},
				"city-gray": {
					50: "#F8FAFC",
					100: "#F1F5F9",
					200: "#E2E8F0",
					300: "#CBD5E1",
					400: "#94A3B8",
					500: "#64748B",
					600: "#475569",
					700: "#334155",
					800: "#1E293B",
					900: "#0F172A",
				},
			},
			fontSize: {
				"2xs": "0.65rem",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"pulse-slow": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.8" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-down": {
					"0%": { opacity: "0", transform: "translateY(-10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-up": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-down": {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-in-left": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
				},
				"spin-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-slow": "pulse-slow 3s ease-in-out infinite",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-up": "fade-up 0.5s ease-out",
				"fade-down": "fade-down 0.5s ease-out",
				"slide-up": "slide-up 0.3s ease-out",
				"slide-down": "slide-down 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.3s ease-out",
				"slide-in-left": "slide-in-left 0.3s ease-out",
				float: "float 3s ease-in-out infinite",
				"spin-slow": "spin-slow 8s linear infinite",
			},
			backdropBlur: {
				xs: '2px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
