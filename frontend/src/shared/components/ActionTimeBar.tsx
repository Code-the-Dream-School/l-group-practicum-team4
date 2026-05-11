import styles from "./ActionTimeBar.module.css";
import { useEffect, useState } from "react";

function ActionTimeBar({
	actionTime,
	baseTime,
}: {
	actionTime: number;
	baseTime: number;
}) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const now = Date.now();
			const remaining = actionTime - now;

			const calculatedProgress = Math.max(
				0,
				Math.min(100, ((baseTime - remaining) / baseTime) * 100),
			);

			setProgress(calculatedProgress);
		};

		updateProgress();

		const interval = setInterval(updateProgress, 100);

		return () => clearInterval(interval);
	}, [actionTime]);

	return (
		<div className={styles["container"]}>
			<div className={styles.barFill} style={{ width: `${progress}%` }} />
		</div>
	);
}

export default ActionTimeBar;
