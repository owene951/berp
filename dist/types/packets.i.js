"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packets = void 0;
/* eslint-disable @typescript-eslint/no-empty-interface */
__exportStar(require("./packetTypes.i"), exports);
/**
 * All Packets Combined
 *
 * `Warn`: Some of the bindings may be incorrect/outdated
 */
var Packets;
(function (Packets) {
    /**
     * `Bound To Server`
     * ___
     * Sent by the client when the client initially tries to join the server.
     *
     * It is the first packet sent and contains a chain of tokens with data specific to the player.
     */
    Packets["Login"] = "login";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server after the login packet is sent.
     * It will contain a status stating either the login was successful or what went wrong.
     */
    Packets["PlayStatus"] = "play_status";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server asking for a handshake with a token containing the needed "salt" to start packet encryption.
     */
    Packets["ServerToClientHandshake"] = "server_to_client_handshake";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client once the client has successfully started encryption.
     *
     * This packet should be the first encrypted packet sent to the server and all following packets should be encrypted aswell.
     */
    Packets["ClientToServerHandshake"] = "client_to_server_handshake";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server when the client is disconnected containing information about the disconnection.
     */
    Packets["Disconnect"] = "disconnect";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server containing info of all resource packs applied.
     *
     * This packet can be used to download the packs on the server.
     *
     * If you are just trying to join the server however just send a `ResourcePackClientResponse` with a status of `completed` and ignore the info on this packet completly.
     */
    Packets["ResourcePacksInfo"] = "resource_packs_info";
    /**
     * `Bound To Client`
     * ___
     * Similar to `ResourcePacksInfo`
     *
     * Send `ResourcePackClientResponse` with a status of `completed` to continue past this packet.
     */
    Packets["ResourcePacksStack"] = "resource_pack_stack";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client stating its response to the packets `ResourcePacksInfo` and or `ResourcePacksStack`
     */
    Packets["ResourcePackClientResponse"] = "resource_pack_client_response";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client to send chat messages.
     *
     * Sent by the server to forward messages, popups, tips, json, etc.
     */
    Packets["Text"] = "text";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to update the current time client-side. The client actually advances time
     * client-side by itself, so this packet does not need to be sent each tick. It is merely a means
     * of synchronizing time between server and client.
     */
    Packets["SetTime"] = "set_time";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to send information about the world the player will be spawned in.
     */
    Packets["StartGame"] = "start_game";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to add a new client for an individual client. It is one of the few entities that cannot be added via the `AddEntity` packet.
     */
    Packets["AddPlayer"] = "add_player";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to add a client-sided entity. It is used for every entity except other players, paintings and items,
     * for which the `AddPlayer`, `AddPainting`, and `AddItemEntity` packets are used.
     */
    Packets["AddEntity"] = "add_entity";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to remove an entity that currently exists in the world from the client-side.
     *
     * Sending this packet if the client cannot already see this entity will have no effect
     */
    Packets["RemoveEntity"] = "remove_entity";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to add a dropped item client-side. It is one of the few entities that cannot be added via the `AddEntity` packet.
     */
    Packets["AddItemEntity"] = "add_item_entity";
    /**
     * `Bound To Client`
     * ___
     * Sent by the serer when a player picks up an item to remove it from the client-side.
     *
     * It will remove the item entity then play the pickup animation.
     */
    Packets["TakeItemEntity"] = "take_item_entity";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to move an entity to an absolute position.
     *
     * This packet is typically used for movements where high accuracy is not needed, such as long range teleporting.
     *
     * Sent by the client when riding a mountable.
     */
    Packets["MoveEntity"] = "move_entity";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by client to send their movement to the server.
     *
     * Sent by the server to update the movement for other clients
     * ___
     * `Developers Notes`
     *
     * The client can use this for a teleporting cheat unless the server has some form of movement correction enabled.
     */
    Packets["MovePlayer"] = "move_player";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client when it jumps while riding an entity that has the WASDControlled entity flag set, for example when riding a horse.
     *
     * According to MiNET this can also be sent from the server to the client, but details on this are unknown.
     */
    Packets["RiderJump"] = "rider_jump";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to update a block client-side without resending the entire chunk that the block is located in. It is particularly useful for small modifications like block breaking/placing.
     */
    Packets["UpdateBlock"] = "update_block";
    /**
     * `Bound To Client`
     * ___
     * Similar to `AddEntity` except its for adding a painting.
     *
     * ¯\\\_(ツ)\_/¯
     */
    Packets["AddPainting"] = "add_painting";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client and the server to maintain a synchronized server-authoritative tick between the client and the server. The client sends this packet first, and the server should reply with another one of these packets including the response time. This send/response loop should be set at an interval to maintain synchronization.
     */
    Packets["TickSync"] = "tick_sync";
    /**
     * `Bound To Server & Client`
     * ___
     * Client communicates to server it made a sound server does same back.
     */
    Packets["LevelSoundEventOld"] = "level_sound_event_old";
    /**
     * `Bound To Client`
     * ___
     * Instead of player sending it made a sound to the server like `LevelSoundEventOld`. The server controls all sounds now.
     */
    Packets["LevelEvent"] = "level_event";
    /**
     * `Bound To Client`
     * ___
     * Has something to do with block state change and/or blocks the cause a sound event.
     */
    Packets["BlockEvent"] = "block_event";
    /**
     * `Bound To Server & Client`
     * ___
     * Something to do with triggering an entities events. EG: when two mobs make a baby it emits an event that causes heart particles.
     */
    Packets["EntityEvent"] = "entity_event";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to tell client-side to start emitting a paricle effect from an entity.
     */
    Packets["MobEffect"] = "mob_effect";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to update the clients arributes. I assume this has to do with potion effects.
     */
    Packets["UpdateAttributes"] = "update_attributes";
    /**
     * `Bound To Server & Client`
     * ___
     * InventoryTransaction is a packet sent by the client. It essentially exists out of multiple sub-packets,
     * each of which have something to do with the inventory in one way or another. Some of these sub-packets
     * directly relate to the inventory, others relate to interaction with the world that could potentially
     * result in a change in the inventory.
     *
     * It is sent by the server to assumably sync the players inventory with what the server believes is your inventory,
     * however this could be wrong and it is only used so the server can add/remove/update items in the clients inventory.
     * ___
     * `Developers Notes`
     *
     * This could be heavily exploited for things such as duplicating items, giving items, updating items nbt, enchanting items, editing item attributes, etc.
     */
    Packets["InventoryTransaction"] = "inventory_transaction";
    /**
     * `Bound To Server & Client`
     * ___
     * Used to update a mobs equipment. EG: Zombie has sword.
     */
    Packets["MobEquipment"] = "mob_equipment";
    /**
     * `Bound To Server & Client`
     * ___
     * Used to update a armor. EG: Zombie with helmet.
     */
    Packets["MobArmorEquipment"] = "mob_armor_equipment";
    /**
     * `Bound To Server & Client`
     * ___
     * Interact is sent by the client when it interacts with another entity in some way. It used to be used for
     * normal entity and block interaction, but this is no longer the case now.
     */
    Packets["Interact"] = "interact";
    /**
     * `Bound To Server`
     * ___
     * Used when client uses the pick block binding to switch to the picked block or request a transaction for the picked block.
     */
    Packets["BlockPickRequest"] = "block_pick_request";
    /**
     * `Bound To Server`
     * ___
     * Similar to `BlockPickRequest` except for an entity instead of a block.
     */
    Packets["EntityPickRequest"] = "entity_pick_request";
    /**
     * `Bound To Server`
     * ___
     * PlayerAction is sent by the client when it executes any action, for example starting to sprint, swim,
     * starting the breaking of a block, dropping an item, etc.
     */
    Packets["PlayerAction"] = "player_action";
    /**
     * `Bound To Client`
     * ___
     * Presumably sent when armor is damaged to update its damage value.
     */
    Packets["HurtArmor"] = "hurt_armor";
    /**
     * `Bound To Server & Client`
     * ___
     * Used to update an entities metadata.
     */
    Packets["SetEntityData"] = "set_entity_data";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to change the client-side velocity of an entity. It is usually used
     * in combination with server-side movement calculation.
     *
     * Apparently the client can send something in regards to this aswell. What it is used for it unknown.
     */
    Packets["SetEntityMotion"] = "set_entity_motion";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to initiate an entity link client-side, meaning one entity will start
     * riding another.
     */
    Packets["SetEntityLink"] = "set_entity_link";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to set the health of the client.
     * This packet should no longer be used. Instead, the health attribute should be used so that the health and maximum health may be changed directly.
     */
    Packets["SetHealth"] = "set_health";
    /**
     * `Bound To Client`
     * ___
     * Sent by server when client spawn position is set.
     */
    Packets["SetSpawnPosition"] = "set_spawn_position";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to send a client animation from one client to all viewers of that client.
     * Sent by the client to tell the server it has started an animation.
     */
    Packets["Animate"] = "animate";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent when a player needs to respawn. Exact usage for client & server is unclear.
     */
    Packets["Respawn"] = "respawn";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to open a container client-side. This container must be physically
     * present in the world, for the packet to have any effect. Unlike Java Edition, Bedrock Edition requires that
     * chests for example must be present and in range to open its inventory.
     */
    Packets["ContainerOpen"] = "container_open";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to close a container the player currently has opened, which was opened
     * using the ContainerOpen packet, or by the client to tell the server it closed a particular container, such
     * as the crafting grid.
     */
    Packets["ContainerClose"] = "container_close";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to the client. It used to be used to link hot bar slots of the player to
     * actual slots in the inventory, but as of 1.2, this was changed and hot bar slots are no longer a free
     * floating part of the inventory.
     * Since 1.2, the packet has been re-purposed, but its new functionality is not clear.
     */
    Packets["PlayerHotbar"] = "player_hotbar";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to update the full content of a particular inventory. It is usually
     * sent for the main inventory of the player, but also works for other inventories that are currently opened
     * by the player.
     */
    Packets["InventoryContent"] = "inventory_content";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to update a single slot in one of the inventory windows that the client
     * currently has opened. Usually this is the main inventory, but it may also be the off hand or, for example,
     * a chest inventory.
     */
    Packets["InventorySlot"] = "inventory_slot";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to update specific data of a single container, meaning a block such
     * as a furnace or a brewing stand. This data is usually used by the client to display certain features
     * client-side.
     */
    Packets["ContainerSetData"] = "container_set_data";
    /**
     * `Bound To Client`
     * ___
     * Presumably sent by the server describing all recipes. Exact usage unknown.
     */
    Packets["CraftingData"] = "crafting_data";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client when it crafts a particular item. Note that this packet may be fully
     * ignored, as the InventoryTransaction packet provides all the information required.
     *
     * Unknown when or why it is sent by server
     */
    Packets["CraftingEvent"] = "crafting_event";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to make the client 'select' a hot bar slot. It currently appears to
     * be broken however, and does not actually set the selected slot to the hot bar slot set in the packet.
     */
    Packets["GUIDataPickItem"] = "gui_data_pick_item";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to update game-play related features, in particular permissions to
     * access these features for the client. It includes allowing the player to fly, build and mine, and attack
     * entities. Most of these flags should be checked server-side instead of using this packet only.
     * The client may also send this packet to the server when it updates one of these settings through the
     * in-game settings interface. The server should verify if the player actually has permission to update those
     * settings.
     */
    Packets["AdventureSettings"] = "adventure_settings";
    /**
     * `Bound To Server & Client`
     * ___
     * Presumably sent by the server & client to update a blocks nbt.
     */
    Packets["BlockEntityData"] = "block_entity_data";
    /**
     * `Bound To Server`
     * ___
     * Seems like an more precise version of `MovePlayer`. It appears to be a way to tell the server the current input.
     *
     * EG: Moving 0.5x will continue moving you at 0.5x until another packet is sent saying client is now moving at 0x
     */
    Packets["PlayerInput"] = "player_input";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to provide the client with a chunk of a world data (16xYx16 blocks).
     * Typically a certain amount of chunks is sent to the client before sending it the spawn PlayStatus packet,
     * so that the client spawns in a loaded world.
     */
    Packets["LevelChunk"] = "level_chunk";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to tell client whether or not to render all commands client-side.
     */
    Packets["SetCommandsEnabled"] = "set_commands_enabled";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to tell client currently difficulty presumably.
     */
    Packets["SetDifficulty"] = "set_difficulty";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to tell client currently dimension presumably.
     */
    Packets["ChangeDimension"] = "change_dimension";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to update the game type (game mode) of the player.
     *
     * Can also be sent by client to request a gamemode update. Server should verify client has the correct permissions to do so first.
     */
    Packets["SetPlayerGameType"] = "set_player_game_type";
    /**
     * `Bound To Client`
     * ___
     * Sent by server containing an array of all the current players. Usually used by client to display all users in a playerlist in the pause menu.
     */
    Packets["PlayerList"] = "player_list";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to send an event. It is typically sent to the client for
     * telemetry reasons.
     */
    Packets["SimpleEvent"] = "simple_event";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to send an event with additional data. It is typically sent to the client for
     * telemetry reasons.
     */
    Packets["Event"] = "event";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to summon and render a exp orb client-side.
     */
    Packets["SpawnExperienceOrb"] = "spawn_experience_orb";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to the client to update the data of a map shown to the client.
     * It is sent with a combination of flags that specify what data is updated.
     * The `ClientBoundMapItemData` packet may be used to update specific parts of the map only. It is not required
     * to send the entire map each time when updating one part.
     */
    Packets["ClientboundMapItemData"] = "clientbound_map_item_data";
    /**
     * `Bound To Server & Client`
     * ___
     * Used to request the data of a map.
     */
    Packets["MapInfoRequest"] = "map_info_request";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client to the server to update the server on the chunk view radius that
     * it has set in the settings. The server may respond with a `ChunkRadiusUpdated` packet with either the chunk
     * radius requested, or a different chunk radius if the server chooses so.
     */
    Packets["RequestChunkRadius"] = "request_chunk_radius";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server in response to a `RequestChunkRadius` packet. It defines the chunk
     * radius that the server allows the client to have. This may be lower than the chunk radius requested by the
     * client in the RequestChunkRadius packet.
     */
    Packets["ChunkRadiusUpdate"] = "chunk_radius_update";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent when an item in an item frame is dropped presumably.
     */
    Packets["ItemFrameDropItem"] = "item_frame_drop_item";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to update game rules client side.
     */
    Packets["GameRulesChanged"] = "game_rules_changed";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to use an Education Edition camera on a player. It produces an image client-side.
     */
    Packets["Camera"] = "camera";
    /**
     * `Bound To Server & Client`
     * ___
     * Used to set boss event data.
     * Sent by the server to presumably update the client and vice-versa.
     */
    Packets["BossEvent"] = "boss_event";
    /**
     * `Bound To Client`
     * ___
     * Send by server to show the client the credits screen.
     */
    Packets["ShowCredits"] = "show_credits";
    /**
     * `Bound To Client`
     * ___
     * Sends a list of commands to the client. Commands can have
     * arguments, and some of those arguments can have 'enum' values, which are a list of possible
     * values for the argument. The serialization is rather complex and involves palettes like chunks.
     */
    Packets["AvailableCommands"] = "available_commands";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to request the execution of a server-side command. Although some
     * servers support sending commands using the Text packet, this packet is guaranteed to have the correct
     * result.
     */
    Packets["CommandRequest"] = "command_request";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to update a command block at a specific position. The command
     * block may be either a physical block or an entity.
     */
    Packets["CommandBlockUpdate"] = "command_block_update";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server containing the results of a command executed.
     * It is assumed this includes all commands executed even if not by the client listening for outputs,
     * however, this is unknown.
     */
    Packets["CommandOutput"] = "command_output";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to update the trades offered by a villager to a player. It is sent at the
     * moment that a player interacts with a villager.
     */
    Packets["UpdateTrade"] = "update_trade";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to the client upon opening a horse inventory. It is used to set the
     * content of the inventory and specify additional properties, such as the items that are allowed to be put
     * in slots of the inventory.
     */
    Packets["UpdateEquipment"] = "update_equipment";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to the client to inform the client about the data contained in
     * one of the resource packs that are about to be sent.
     */
    Packets["ResourcePackDataInfo"] = "resource_pack_data_info";
    /**
     * `Bound To Client`
     * ___
     * Sent to the client so that the client can download the resource pack. Each packet
     * holds a chunk of the compressed resource pack, of which the size is defined in the `ResourcePackDataInfo`
     * packet sent before.
     */
    Packets["ResourcePackChunkData"] = "resource_pack_chunk_data";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to request a chunk of data from a particular resource pack,
     * that it has obtained information about in a `ResourcePackDataInfo` packet.
     */
    Packets["ResourcePackChunkRequest"] = "resource_pack_chunk_request";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to transfer client to another server.
     */
    Packets["Transfer"] = "transfer";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to start playing a sound client-side.
     */
    Packets["PlaySound"] = "play_sound";
    /**
     * `Bound To Client`
     * ___
     * Sent by server to stop playing a sound client-side.
     */
    Packets["StopSound"] = "stop_sound";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to make a title, subtitle or action bar shown to a player. It has several
     * fields that allow setting the duration of the titles.
     */
    Packets["SetTitle"] = "set_title";
    /**
     * `Bound To Client`
     * ___
     * Packet usage is unknown.
     */
    Packets["AddBehaviorTree"] = "add_behavior_tree";
    /**
     * `Bound To Client`
     * ___
     * Sent by the client when it updates a structure block using the in-game UI. The
     * data it contains depends on the type of structure block that it is. In Minecraft Bedrock Edition v1.11,
     * there is only the Export structure block type, but in v1.13 the ones present in Java Edition will,
     * according to the wiki, be added too.
     */
    Packets["StructureBlockUpdate"] = "structure_block_update";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to show a Marketplace store offer to a player. It opens a window
     * client-side that displays the item.
     * The `ShowStoreOffer` packet only works on the partnered servers: Servers that are not partnered will not have
     * store buttons show up in the in-game pause menu and will, as a result, not be able to open store offers
     * a store buttons show up in the in-game pause menu and will, as a result, not be able to open store offers
     * with the domain of one of the partnered servers.
     */
    Packets["ShowStoreOffer"] = "show_store_offer";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to the server to notify the server it purchased an item from the
     * Marketplace store that was offered by the server. The packet is only used for partnered servers.
     */
    Packets["PurchaseReceipt"] = "purchase_receipt";
    /**
     * `Bound To Server & Client`
     * ___
     * Presumably sent by both sides to update a clients skin.
     */
    Packets["PlayerSkin"] = "player_skin";
    /**
     * `Bound To Client`
     * ___
     * Sent when a sub-client joins the server while another client is already connected to it.
     * The packet is sent as a result of split-screen game play, and allows up to four players to play using the
     * same network connection. After an initial Login packet from the 'main' client, each sub-client that
     * connects sends a `SubClientLogin` to request their own login.
     */
    Packets["SubClientLogin"] = "sub_client_login";
    /**
     * `Bound To Client`
     * ___
     * Is used to make the client connect to a custom websocket server. Websockets have the ability to execute commands on behalf of the client
     * along with listening to a handful of events that get fired on the client side.
     */
    Packets["InitiateWebSocketConnection"] = "initiate_web_socket_connection";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to let the client know what entity type it was last hurt by. At this
     * moment, the packet is useless and should not be used. There is no behaviour that depends on if this
     * packet is sent or not.
     */
    Packets["SetLastHurtBy"] = "set_last_hurt_by";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client when it edits a book. It is sent each time a modification was made and the
     * player stops its typing 'session', rather than simply after closing the book.
     */
    Packets["BookEdit"] = "book_edit";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client when it interacts with an NPC.
     * The packet is specifically made for Education Edition, where NPCs are available to use.
     * As of recent update NPCs are now available in the production build of mcbe.
     */
    Packets["NPCRequest"] = "npc_request";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to transfer a photo (image) file to the client. It is typically used
     * to transfer photos so that the client can display it in a portfolio in Education Edition.
     * While previously usable in the default Bedrock Edition, the displaying of photos in books was disabled and
     * the packet now has little use anymore.
     */
    Packets["PhotoTransfer"] = "photo_transfer";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to make the client open a form. This form may be either a modal form
     * which has two options, a menu form for a selection of options and a custom form for properties.
     */
    Packets["ModalFormRequest"] = "modal_form_request";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client in response to a `ModalFormRequest`, after the player has submitted
     * the form sent. It contains the options/properties selected by the player, or a JSON encoded 'null' if
     * the form was closed by clicking the X at the top right corner of the form.
     */
    Packets["ModalFormResponse"] = "modal_form_response";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to request the settings specific to the server. These settings
     * are shown in a separate tab client-side, and have the same structure as a custom form.
     * `ServerSettingsRequest` has no fields.
     */
    Packets["ServerSettingsRequest"] = "server_settings_request";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server in response to a `ServerSettingsRequest` from the
     * client. It is structured the same as a `ModalFormRequest` packet, and if filled out correctly, will show
     * a specific tab for the server in the settings of the client. A `ModalFormResponse` packet is sent by the
     * client in response to a ServerSettingsResponse, when the client fills out the settings and closes the
     * settings again.
     */
    Packets["ServerSettingsResponse"] = "server_settings_response";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to show the XBOX Live profile of one player to another.
     */
    Packets["ShowProfile"] = "show_profile";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client when it toggles the default game type in the settings UI, and is
     * sent by the server when it actually changes the default game type, resulting in the toggle being changed
     * in the settings UI.
     */
    Packets["SetDefaultGameType"] = "set_default_game_type";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to remove a scoreboard objective. It is used to stop showing a
     * scoreboard to a player.
     */
    Packets["RemoveObjective"] = "remove_objective";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to display an object as a scoreboard to the player. Once sent,
     * it should be followed up by a `SetScore` packet to set the lines of the packet.
     */
    Packets["SetDisplayObjective"] = "set_display_objective";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to send the contents of a scoreboard to the player. It may be used to either
     * add, remove or edit entries on the scoreboard.
     */
    Packets["SetScore"] = "set_score";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client to let the server know it started a chemical reaction in Education Edition,
     * and is sent by the server to other clients to show the effects.
     * The packet is only functional if Education features are enabled.
     */
    Packets["LabTable"] = "lab_table";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to synchronise the falling of a falling block entity with the
     * transitioning back and forth from and to a solid block. It is used to prevent the entity from flickering,
     * and is used in places such as the pushing of blocks with pistons.
     */
    Packets["UpdateBlockSynced"] = "update_block_synced";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to move an entity. The packet is specifically optimised to save as
     * much space as possible, by only writing non-zero fields.
     * As of 1.16.100, this packet no longer actually contains any deltas.
     */
    Packets["MoveEntityDelta"] = "move_entity_delta";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to change the identity type of one of the entries on a
     * scoreboard. This is used to change, for example, an entry pointing to a player, to a fake player when it
     * leaves the server, and to change it back to a real player when it joins again.
     * In non-vanilla situations, the packet is quite useless.
     */
    Packets["SetScoreboardIdentity"] = "set_scoreboard_identity";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client in response to a PlayStatus packet with the status set
     * to spawn. The packet marks the moment at which the client is fully initialised and can receive any packet
     * without discarding it.
     */
    Packets["SetLocalPlayerAsInitialized"] = "set_local_player_as_initialized";
    /**
     * `Bound To Client`
     * ___
     * Packet usage is unknown.
     */
    Packets["UpdateSoftEnum"] = "update_soft_enum";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server (and the client, on development builds) to measure the latency
     * over the entire Minecraft stack, rather than the RakNet latency. It has other usages too, such as the
     * ability to be used as some kind of acknowledgement packet, to know when the client has received a certain
     * other packet.
     */
    Packets["NetworkStackLatency"] = "network_stack_latency";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by both the client and the server. It is a way to let scripts communicate with
     * the server, so that the client can let the server know it triggered an event, or the other way around.
     * It is essentially an RPC kind of system.
     */
    Packets["ScriptCustomEvent"] = "script_custom_event";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to spawn a particle effect client-side. Unlike other packets that
     * result in the appearing of particles, this packet can show particles that are not hardcoded in the client.
     * They can be added and changed through behaviour packs to implement custom particles.
     */
    Packets["SpawnParticleEffect"] = "spawn_particle_effect";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server at the start of the game to let the client know all
     * entities that are available on the server.
     */
    Packets["AvailableEntityIdentifiers"] = "available_entity_identifiers";
    /**
     * `Bound To Server & Client`
     * ___
     * Not used. Use `LevelSoundEvent`
     */
    Packets["LevelSoundEventV2"] = "level_sound_event_v2";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to change the point around which chunks are and remain
     * loaded. This is useful for mini-game servers, where only one area is ever loaded, in which case the
     * `NetworkChunkPublisherUpdate` packet can be sent in the middle of it, so that no chunks ever need to be
     * additionally sent during the course of the game.
     * In reality, the packet is not extraordinarily useful, and most servers just send it constantly at the
     * position of the player.
     * If the packet is not sent at all, no chunks will be shown to the player, regardless of where they are sent.
     */
    Packets["NetworkChunkPublisherUpdate"] = "network_chunk_publisher_update";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to let the client know all biomes that are available and
     * implemented on the server side. It is much like the `AvailableActorIdentifiers` packet, but instead
     * functions for biomes.
     */
    Packets["BiomeDefinitionList"] = "biome_definition_list";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to make any kind of built-in sound heard to a player. It is sent to,
     * for example, play a stepping sound or a shear sound. The packet is also sent by the client, in which case
     * it could be forwarded by the server to the other players online. If possible, the packets from the client
     * should be ignored however, and the server should play them on its own accord.
     */
    Packets["LevelSoundEvent"] = "level_sound_event";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to send a 'generic' level event to the client. This packet sends an
     * NBT serialised object and may for that reason be used for any event holding additional data.
     */
    Packets["LevelEventGeneric"] = "level_event_generic";
    /**
     * `Bound To Client`
     * ___
     * Sent by the client to update the server on which page was opened in a book on a lectern,
     * or if the book should be removed from it.
     */
    Packets["LecternUpdate"] = "lectern_update";
    /**
     * `Bound To Client`
     * ___
     * This packet was removed when mixer died presumably.
     */
    Packets["VideoStreamConnect"] = "video_stream_connect";
    /**
     * `Bound To Client`
     * ___
     * This is NOT a Minecraft entity, but an entity in the Entity Component System (ECS)
     * for the game engine Minecrat Bedrock uses. Internally, all 'Minecraft entities' are
     * known as Actors including in packet names and fields. However, these are irrelevant
     * internal details so we don't do the renames in these protocol definitions, for simplicity we just use Entity.
     * ___
     * Sent by the server to the client. Its function is not entirely clear: It does not add an
     * entity in the sense of an in-game entity, but has to do with the ECS that Minecraft uses.
     */
    Packets["AddEcsEntity"] = "add_ecs_entity";
    /**
     * `Bound To Client`
     * ___
     * sent by the server to the client. Its function is not entirely clear: It does not remove an
     * entity in the sense of an in-game entity, but has to do with the ECS that Minecraft uses.
     */
    Packets["RemoveEcsEntity"] = "remove_ecs_entity";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client to the server at the start of the game. It is sent to let the
     * server know if it supports the client-side blob cache. Clients such as Nintendo Switch do not support the
     * cache, and attempting to use it anyway will fail.
     */
    Packets["ClientCacheStatus"] = "client_cache_status";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to show a certain animation on the screen of the player.
     * The packet is used, as an example, for when a raid is triggered and when a raid is defeated.
     */
    Packets["OnScreenTextureAnimation"] = "on_screen_texture_animation";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to create a locked copy of one map into another map. In vanilla,
     * it is used in the cartography table to create a map that is locked and cannot be modified.
     */
    Packets["MapCreateLockedCopy"] = "map_create_locked_copy";
    /**
     * `Bound To Client`
     * ___
     * Sent by the client to request data of a structure.
     */
    Packets["StructureTemplateDataExportRequest"] = "structure_template_data_export_request";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to send data of a structure to the client in response
     * to a `StructureTemplateDataRequest` packet.
     */
    Packets["StructureTemplateDataExportResponse"] = "structure_template_data_export_response";
    /**
     * `Bound To Client`
     * ___
     * No longer used.
     */
    Packets["UpdateBlockProperties"] = "update_block_properties";
    /**
     * `Bound To Server`
     * ___
     * Part of the blob cache protocol. It is sent by the client to let the server know
     * what blobs it needs and which blobs it already has, in an ACK type system.
     */
    Packets["ClientCacheBlobStatus"] = "client_cache_blob_status";
    /**
     * `Bound To Client`
     * ___
     * Part of the blob cache protocol. It is sent by the server in response to a
     * `ClientCacheBlobStatus` packet and contains the blob data of all blobs that the client acknowledged not to
     * have yet.
     */
    Packets["ClientCacheMissResponse"] = "client_cache_miss_response";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to update Minecraft: Education Edition related settings.
     * It is unused by the normal base game as far as we know.
     */
    Packets["EducationSettings"] = "education_settings";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the client to update multi-player related settings server-side and sent back
     * to online players by the server.
     * The `MultiPlayerSettings` packet is a Minecraft: Education Edition packet. It has no functionality for the
     * base game.
     */
    Packets["MultiplayerSettings"] = "multiplayer_settings";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client when it changes a setting in the settings that results in the issuing
     * of a command to the server, such as when Show Coordinates is enabled.
     */
    Packets["SettingsCommand"] = "settings_command";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to request the dealing damage to an anvil. This packet is completely
     * pointless and the server should never listen to it.
     */
    Packets["AnvilDamage"] = "anvil_damage";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to tell the client that it should be done using the item it is
     * currently using.
     */
    Packets["CompletedUsingItem"] = "completed_using_item";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the server to update a variety of network settings. These settings modify the
     * way packets are sent over the network stack.
     */
    Packets["NetworkSettings"] = "network_settings";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to allow for server authoritative movement. It is used to synchronise
     * the player input with the position server-side.
     * The client sends this packet when the `ServerAuthoritativeMovementMode` field in the `StartGame` packet is set
     * to true, instead of the `MovePlayer` packet. The client will send this packet once every tick.
     */
    Packets["PlayerAuthInput"] = "player_auth_input";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to set the creative inventory's content for a player
     * Introduced in 1.16, this packet replaces the previous method - sending an `InventoryContent` packet with
     * creative inventory window ID.
     * As of v1.16.100, this packet must be sent during the login sequence. Not sending it will stop the client
     * from joining the server.
     */
    Packets["CreativeContent"] = "creative_content";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to update the enchantment options displayed when the user opens
     * the enchantment table and puts an item in. This packet was added in 1.16 and allows the server to decide on
     * the enchantments that can be selected by the player.
     * The `PlayerEnchantOptions` packet should be sent once for every slot update of the enchantment table. The
     * vanilla server sends an empty `PlayerEnchantOptions` packet when the player opens the enchantment table
     * (air is present in the enchantment table slot) and sends the packet with actual enchantments in it when
     * items are put in that can have enchantments.
     */
    Packets["PlayerEnchantOptions"] = "player_enchant_options";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to change item stacks in an inventory. It is essentially a
     * replacement of the `InventoryTransaction` packet added in 1.16 for inventory specific actions, such as moving
     * items around or crafting. The `InventoryTransaction` packet is still used for actions such as placing blocks
     * and interacting with entities.
     */
    Packets["ItemStackRequest"] = "item_stack_request";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server in response to an `ItemStackRequest` packet from the client. This
     * packet is used to either approve or reject ItemStackRequests from the client. If a request is approved, the
     * client will simply continue as normal. If rejected, the client will undo the actions so that the inventory
     * should be in sync with the server again.
     */
    Packets["ItemStackResponse"] = "item_stack_response";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to damage the armour of a player. It is a very efficient packet,
     * but generally it's much easier to just send a slot update for the damaged armour.
     */
    Packets["PlayerArmorDamage"] = "player_armor_damage";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to change the game mode of a player. It is functionally
     * identical to the `SetPlayerGameType` packet.
     */
    Packets["UpdatePlayerGameType"] = "update_player_game_type";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client to request the position and dimension of a
     * 'tracking ID'. These IDs are tracked in a database by the server. In 1.16, this is used for lodestones.
     * The client will send this request to find the position a lodestone compass needs to point to. If found, it
     * will point to the lodestone. If not, it will start spinning around.
     * A `PositionTrackingDBServerBroadcast` packet should be sent in response to this packet.
     */
    Packets["PositionTrackingDBRequest"] = "position_tracking_db_request";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server in response to the
     * `PositionTrackingDBClientRequest` packet. This packet is, as of 1.16, currently only used for lodestones. The
     * server maintains a database with tracking IDs and their position and dimension. The client will request
     * these tracking IDs, (NBT tag set on the lodestone compass with the tracking ID?) and the server will
     * respond with the status of those tracking IDs.
     * What is actually done with the data sent depends on what the client chooses to do with it. For the
     * lodestone compass, it is used to make the compass point towards lodestones and to make it spin if the
     * lodestone at a position is no longer there.
     */
    Packets["PositionTrackingDBBroadcast"] = "position_tracking_db_broadcast";
    /**
     * `Bound To Server`
     * ___
     * Sent by the client when it receives an invalid packet from the server. It holds
     * some information on the error that occurred.
     */
    Packets["PacketViolationWarning"] = "packet_violation_warning";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to the client. There is a predictive movement component for
     * entities. This packet fills the "history" of that component and entity movement is computed based on the
     * points. Vanilla sends this packet instead of the `SetActorMotion` packet when 'spatial optimisations' are
     * enabled.
     */
    Packets["MotionPredictionHints"] = "motion_prediction_hints";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to animate an entity client-side. It may be used to play a single
     * animation, or to activate a controller which can start a sequence of animations based on different
     * conditions specified in an animation controller.
     * Much of the documentation of this packet can be found at
     * https://minecraft.gamepedia.com/Bedrock_Edition_beta_animation_documentation.
     */
    Packets["AnimateEntity"] = "animate_entity";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to make the camera shake client-side. This feature was added for map-making partners.
     */
    Packets["CameraShake"] = "camera_shake";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to render the different fogs in the Stack. The types of fog are controlled
     * by resource packs to change how they are rendered, and the ability to create custom fog.
     */
    Packets["PlayerFog"] = "player_fog";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server if and only if `StartGame.ServerAuthoritativeMovementMode`
     * is set to `AuthoritativeMovementModeServerWithRewind`. The packet is used to correct movement at a specific
     * point in time.
     */
    Packets["CorrectPlayerMovePrediction"] = "correct_player_move_prediction";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to attach client-side components to a custom item.
     */
    Packets["ItemComponent"] = "item_component";
    /**
     * `Bound To Server & Client`
     * ___
     * Sent by the both the client and the server. The client sends the packet to the server to
     * allow the server to filter the text server-side. The server then responds with the same packet and the
     * safer version of the text.
     */
    Packets["FilterTextPacket"] = "filter_text_packet";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to spawn an outlined cube on client-side.
     */
    Packets["DebugRenderer"] = "debug_renderer";
    /**
     * `Bound To Client`
     * ___
     * Sent by the server to synchronize/update entity properties as NBT, an alternative to Set Entity Data.
     */
    Packets["SyncEntityProperty"] = "sync_entity_property";
    /**
     * `Bound To Client`
     * ___
     * Sends a volume entity's definition and components from server to client.
     */
    Packets["AddVolumeEntity"] = "add_volume_entity";
    /**
     * `Bound To Client`
     * ___
     * Indicates a volume entity to be removed from server to client.
     */
    Packets["RemoveVolumeEntity"] = "remove_volume_entity";
    /**
     * `Bound Unknown`
     * ___
     * In-progress packet. We currently do not know the use case.
     */
    Packets["SimulationType"] = "simulation_type";
    /**
     * `Bound Unknown`
     * ___
     * Packet that allows the client to display dialog boxes for interacting with NPCs.
     */
    Packets["NPC_Dialogue"] = "npc_dialogue";
})(Packets = exports.Packets || (exports.Packets = {}));
