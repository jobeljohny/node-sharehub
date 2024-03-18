const ActionType = require("./action");
const rooms = require("./data");
function handle(id, action) {
  switch (action["type"]) {
    case ActionType.ADD_PARTICIPANT:
      console.log("ADDING PARTICIPANT");
      addParticiptantsToStore(id, action.payload);
      break;
    case ActionType.REMOVE_PARTICIPANT:
      console.log("REMOVE PARTICIPANT");
      removeParticipantFromStore(id, action.payload);
      break;
    case ActionType.ADD_PALETTE:
      console.log("ADD PALETTE");
      addPaletteToStore(id, action.payload);
      break;
    case ActionType.REMOVE_PALETTE:
      console.log("REMOVE PALETTE");
      removePaletteFromStore(id, action.payload);
      break;
    case ActionType.UPDATE_PALETTE_FOODNAME:
      console.log("CHANGE PALETTE NAME");
      changePaletteName(id, action.payload);
      break;
    default:
      break;
  }
}

function addParticiptantsToStore(id, payload) {
  const paletteId = payload.palette;
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === paletteId
  );
  if (palette) {
    payload.participants.forEach((profile) => {
      let isExist = false;
      palette.participants.forEach((p) => {
        if (p.profile.name === profile.name) {
          isExist = true;
        }
      });
      if (!isExist)
        palette.participants.push({
          profile: profile,
          contribution: palette.price,
        });
    });
  }
}
function removeParticipantFromStore(id, payload) {
  const paletteId = payload.palette;
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === paletteId
  );
  if (palette) {
    palette.participants = palette.participants.filter(
      (x) => x.profile.name !== payload.name
    );
  }
}
function addPaletteToStore(id, payload) {
  rooms[id].palettes.push({
    logo: "🍽️",
    id: payload.id,
    name: "-",
    price: 0,
    participants: [],
  });
}

function removePaletteFromStore(id, payload) {
  rooms[id].palettes = rooms[id].palettes.filter(
    (palette) => palette.id !== payload.id
  );
}

function changePaletteName(id,payload){
    const palette = rooms[id].palettes.find(
    (palette) => palette.id === paletteId
  );
  //palette.
}

module.exports = {
  handle,
};
