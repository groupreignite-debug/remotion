// Logo paths in a 24×24 box. Nike, Apple and McDonald's come from simple-icons 16.35.0
// (CC0). simple-icons no longer ships Mercedes, and Target is built from its 1:2:3
// circles in the scene, so both are constructed here. Rendered in off-white only.

export const NIKE =
	'M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z';

export const APPLE_BODY =
	'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z';
export const APPLE_LEAF =
	'M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z';
export const APPLE = `${APPLE_BODY}${APPLE_LEAF}`;

// The Apple body with the bite closed up by a smooth curve: a plain apple silhouette.
export const APPLE_PLAIN =
	'M12.152 6.896C11.204 6.896 9.737 5.818 8.192 5.856C6.152 5.883 4.282 7.039 3.231 8.87C1.114 12.545 2.685 17.973 4.75 20.96C5.763 22.414 6.958 24.05 8.542 23.999C10.062 23.934 10.632 23.012 12.477 23.012C14.308 23.012 14.827 23.999 16.437 23.96C18.074 23.934 19.113 22.48 20.113 21.012C21.269 19.324 21.749 17.687 21.775 17.597C22.38 15.5 22.44 10.06 21.152 8.181C19.723 6.091 17.529 5.857 16.762 5.805C14.762 5.649 13.087 6.895 12.152 6.895Z';
// Circle fitted through the three points of the real bite curve.
export const BITE = {cx: 23.84, cy: 12.73, r: 5.29};

export const MCDONALDS =
	'M17.243 3.006c2.066 0 3.742 8.714 3.742 19.478H24c0-11.588-3.042-20.968-6.766-20.968-2.127 0-4.007 2.81-5.248 7.227-1.241-4.416-3.121-7.227-5.231-7.227C3.031 1.516 0 10.888 0 22.476h3.014c0-10.763 1.658-19.47 3.724-19.47 2.066 0 3.741 8.05 3.741 17.98h2.997c0-9.93 1.684-17.98 3.75-17.98Z';

// Mercedes three-pointed star (without the ring) in a 24 box, centred on (12, 12).
const star = () => {
	const pts: string[] = [];
	for (let i = 0; i < 3; i++) {
		const outer = ((-90 + i * 120) * Math.PI) / 180;
		const inner = ((-30 + i * 120) * Math.PI) / 180;
		pts.push(`${12 + 10.6 * Math.cos(outer)} ${12 + 10.6 * Math.sin(outer)}`);
		pts.push(`${12 + 1.55 * Math.cos(inner)} ${12 + 1.55 * Math.sin(inner)}`);
	}
	return `M${pts.join('L')}Z`;
};
export const MERCEDES_STAR = star();

// Target mark: outer ring 12, white ring 8, centre dot 4 (1 : 2 : 3).
export const TARGET =
	'M12 0a12 12 0 1 0 0 24a12 12 0 1 0 0-24zm0 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16zm0 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8z';
