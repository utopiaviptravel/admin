// turn mongoose documents into plain JSON for the client

export function toTour(t) {
  if (!t) return null;
  return {
    id: String(t._id),
    slug: t.slug,
    title: t.title,
    place: t.place,
    price: t.price,
    date: t.date,
    seats: t.seats,
    active: t.active,
  };
}

export function toOrder(o) {
  return {
    id: String(o._id),
    ref: o.ref,
    firstName: o.firstName,
    lastName: o.lastName,
    phone: o.phone,
    personalId: o.personalId || '',
    tour: toTour(o.tour),
    people: o.people,
    total: o.total,
    method: o.method,
    status: o.status,
    bank: o.bank || '',
    months: o.months || 0,
    history: (o.history || []).map((h) => ({ label: h.label, note: h.note || '', state: h.state, at: h.at })),
    createdAt: o.createdAt,
  };
}
