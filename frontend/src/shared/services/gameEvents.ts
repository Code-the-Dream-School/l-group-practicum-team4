import type { Chest, Trap, Enemy, DroppedItem } from "../models/models";

export type GameObject =
	// | Entrance
	// | Door
	// | Exit
	// | Wall
	Chest | Trap | Enemy | DroppedItem;

export type GameEventType =
	| "ObjectActivated"
	| "ObjectInteracted"
	| "Collision";

export interface GameEvent {
	type: GameEventType;
	object: GameObject;
	objectType: string;
	timestamp: number;
}

class EventEmitter {
	private listeners = new Map<string, ((event: GameEvent) => void)[]>();

	on(eventType: GameEventType, callback: (event: GameEvent) => void) {
		if (!this.listeners.has(eventType)) {
			this.listeners.set(eventType, []);
		}
		this.listeners.get(eventType)!.push(callback);
	}

	off(eventType: GameEventType, callback: (event: GameEvent) => void) {
		const callbacks = this.listeners.get(eventType);
		if (callbacks) {
			this.listeners.set(
				eventType,
				callbacks.filter((cb) => cb !== callback),
			);
		}
	}

	emit(eventType: GameEventType, object: GameObject, objectType: string) {
		const event: GameEvent = {
			type: eventType,
			object,
			objectType,
			timestamp: Date.now(),
		};

		const callbacks = this.listeners.get(eventType);
		callbacks?.forEach((callback) => callback(event));
	}
}

export const gameEvents = new EventEmitter();
