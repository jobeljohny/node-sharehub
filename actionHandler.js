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
      console.log("UPDATE PALETTE NAME");
      updatePaletteNameInStore(id, action.payload);
      break;
    case ActionType.UPDATE_DISH_PRICE:
      console.log("UPDATE DISH PRICE");
      updateDishPriceInStore(id, action.payload);
      break;
    case ActionType.UPDATE_PARTICIPANT_PRICE:
      console.log("UPDATE PARTICIPANT PRICE");
      updateParticipantPriceInStore(id, action.payload);
      break;
    case ActionType.RESET_PALETTE_DEFAULT_PRICE:
      console.log("RESET PALETTE PRICE");
      resetPalettePriceInStore(id, action.payload);
      break;
    case ActionType.SPLIT_EVENLY:
      console.log("SPLIT EVENLY");
      splitPaletteEvenlyInStore(id, action.payload);
      break;
    case ActionType.CLEAR_PALETTE_PARTICIPANTS:
      console.log("CLEAR PALETTE PARTICIPANTS");
      clearPaletteParticipantsInStore(id, action.payload);
      break;
    case ActionType.ADD_PROFILE:
      console.log("ADD PROFILE");
      addProfileToStore(id, action.payload);
      break;
    case ActionType.REMOVE_PROFILE:
      console.log("REMOVE PROFILE");
      removeProfileFromStore(id, action.payload);
      break;
    case ActionType.UPDATE_TAX_DISCOUNT:
      console.log("UPDATE TAX DISCOUNT");
      updateTaxDiscountInStore(id, action.payload);
      break;
    case ActionType.SCAN_RECEIPT_ACTION:
      console.log("SCAN RECEIPT");
      scanReceiptAction(id, action.payload);
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

function updatePaletteNameInStore(id, payload) {
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === payload.id
  );
  if (palette) {
    palette.name = payload.name;
  }
}

function updateDishPriceInStore(id, payload) {
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === payload.id
  );
  if (palette) {
    palette.price = payload.price;
    updateParticipantPrices(palette, payload.price);
  }
}

function updateParticipantPrices(palette, price) {
  palette.participants.forEach((participant) => {
    participant.contribution = price;
  });
}

function updateParticipantPriceInStore(id, payload) {
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === payload.id
  );
  if (palette) {
    const participant = palette.participants.find(
      (participant) => participant.profile.name === payload.name
    );
    if (participant) {
      participant.contribution = payload.contribution;
    }
  }
}

function resetPalettePriceInStore(id, payload) {
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === payload.id
  );
  if (palette) {
    updateParticipantPrices(palette, palette.price);
  }
}

function splitPaletteEvenlyInStore(id, payload) {
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === payload.id
  );
  if (palette) {
    let splitPrice =
      Math.round((palette.price / palette.participants.length) * 100) / 100;
    updateParticipantPrices(palette, splitPrice);
  }
}

function clearPaletteParticipantsInStore(id, payload) {
  const palette = rooms[id].palettes.find(
    (palette) => palette.id === payload.id
  );
  if (palette) {
    palette.participants = [];
  }
}

function addProfileToStore(id, payload) {
  rooms[id].profiles.push({
    hue: payload.profile.hue,
    name: payload.profile.name,
  });
}

function removeProfileFromStore(id, payload) {
  rooms[id].profiles = rooms[id].profiles.filter(
    (profile) => profile.name !== payload.name
  );
}

function updateTaxDiscountInStore(id, payload) {
  rooms[id].tax = payload.tax;
  rooms[id].discount = payload.discount;
}

function scanReceiptAction(id, payload) {
  rooms[id].palettes = payload.palettes;
}

module.exports = {
  handle,
};
