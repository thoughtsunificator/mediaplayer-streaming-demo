import "assets/main.css"

import { Core }  from "domodel"
import { Player, PlayerBinding, PlayerModel } from "mediaplayer-core"
import { StreamingModel, StreamingBinding } from "mediaplayer-streaming"

import HOTKEYS from "data/hotkeys.js"

window.addEventListener("load", async function() {

	const player = new Player()

	Core.run(PlayerModel, {
		parentNode: document.body,
		binding: new PlayerBinding({
			player,
			hotkeys: HOTKEYS,
			model: StreamingModel,
			binding: new StreamingBinding({ player })
		})
	})

	player.emit("media url set", "./resource/trailer.mp4")

})
