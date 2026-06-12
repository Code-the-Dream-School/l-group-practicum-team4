import Modal from "../components/Modal";
import NewHeroForm from "../components/NewHeroForm";
import EditHeroForm from "../components/EditHeroForm";
import HeroCard from "../components/HeroCard";
import styles from "./HomePage.module.css";

import { useDungeon } from "../../Dungeon/hooks/dungeonHook";

export default function HomePageView({
	loading,
	allHeroes,
	selectedCharacter,
	tileset,
	showForm,
	editingCharacter,
	onCreate,
	onEdit,
	onDelete,
	onSelect,
	onCloseModal,
	onSubmit,
	navigate,
}: any) {
	const { state: dungeonState } = useDungeon();

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<h2 className={styles.title}>WELCOME, ADVENTURER!</h2>
				<p className={styles.subtitle}>
					{" "}
					Choose your hero and continue your adventure.{" "}
				</p>

				{loading ? (
					<p>Loading...</p>
				) : (
					<>
						<div className={styles.heroGrid}>
							{allHeroes.filter(Boolean).map((character: any) => {
								const uid = character._id || character.id;
								const isSelected =
									(selectedCharacter?._id ||
										selectedCharacter?.id) === uid;

								return (
									<HeroCard
										key={uid}
										character={character}
										selected={isSelected}
										tileset={tileset}
										onSelect={() =>
											onSelect({ ...character, id: uid })
										}
										onEdit={() => onEdit(character)}
										onDelete={() => onDelete(uid)}
									/>
								);
							})}

							<div className={styles.createCard}>
								<div className={styles.plus}>+</div>
								<h3>Create New Hero</h3>
								<p>
									Build your own custom adventurer for the
									dungeon.
								</p>

								<button
									className={styles.createBtn}
									onClick={onCreate}
								>
									CREATE HERO
								</button>
							</div>
						</div>

						<Modal isOpen={showForm} onClose={onCloseModal}>
							{editingCharacter ? (
								<EditHeroForm
									hero={editingCharacter}
									onSubmit={onSubmit}
									onCancel={onCloseModal}
								/>
							) : (
								<NewHeroForm
									onSubmit={onSubmit}
									onCancel={onCloseModal}
								/>
							)}
						</Modal>

						<div className={styles.bottomSection}>
							<div className={styles.adventureCard}>
								{dungeonState.dungeon ? (
									<>
										<h3>CONTINUE ADVENTURE</h3>
										<p>Dungeon</p>
										<span>{`Level ${dungeonState.dungeon.level}`}</span>
										<button
											className={styles.startBtn}
											onClick={() => navigate("/dungeon")}
										>
											{" "}
											CONTINUE{" "}
										</button>
									</>
								) : (
									<>
										<h3>START ADVENTURE</h3>
										<br></br>
										<br></br>
										<button
											className={styles.startBtn}
											onClick={() => navigate("/dungeon")}
										>
											{" "}
											GO TO DUNGEON{" "}
										</button>
									</>
								)}
							</div>

							<div className={styles.statsCard}>
								<h3>YOUR ADVENTURE</h3>

								<div className={styles.gameStats}>
									<div>
										<strong>
											{dungeonState.dungeons?.length}
										</strong>
										<span>Dungeons</span>
									</div>

									<div>
										<strong>
											{dungeonState?.dungeons
												?.flatMap(
													(dungeon) =>
														dungeon?.enemies || [],
												)
												?.filter(
													(e) =>
														e.status === "Active",
												)?.length ?? 0}
										</strong>
										<span>Enemies defeated</span>
									</div>

									<div>
										<strong>
											{dungeonState?.dungeons
												?.flatMap(
													(dungeon) =>
														dungeon?.enemies || [],
												)
												?.filter(
													(e) =>
														e.status === "Active",
												)?.length ?? 0}
										</strong>
										<span>Active enemies</span>
									</div>

									<div>
										<strong>
											{selectedCharacter?.coins || 0}
										</strong>
										<span>Gold</span>
									</div>

									{/* <div>
										<strong>18h</strong>
										<span>Play Time</span>
									</div> */}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
