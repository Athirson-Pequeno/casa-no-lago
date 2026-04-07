function readObjectIdTimestamp(value) {
  if (!/^[a-f0-9]{24}$/i.test(value || '')) {
    return 0;
  }

  return parseInt(value.slice(0, 8), 16) * 1000;
}

export function getRoomSortTimestamp(room) {
  if (Number.isFinite(room?.sortTimestamp) && room.sortTimestamp > 0) {
    return room.sortTimestamp;
  }

  const createdAtTimestamp = Date.parse(room?.createdAt || '');

  if (Number.isFinite(createdAtTimestamp) && createdAtTimestamp > 0) {
    return createdAtTimestamp;
  }

  return readObjectIdTimestamp(room?.id || room?._id || '');
}

export function sortRoomsByNewest(rooms) {
  return [...rooms].sort((roomA, roomB) => getRoomSortTimestamp(roomB) - getRoomSortTimestamp(roomA));
}
