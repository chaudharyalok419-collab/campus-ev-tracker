# API documentation

Base URL (local): `http://localhost:3000/api/v1`

All protected routes require an `Authorization: Bearer <firebase-id-token>` header. Get the token client-side via `currentUser.getIdToken()`.

## Auth

`POST /auth/create-driver` — admin only. Body: `{ email, password, name, phone, vehicleNumber, licenseNumber }`

`GET /auth/me` — any logged-in user. Returns their profile + role.

`POST /auth/set-admin` — admin only. Body: `{ uid }`. Promotes a user to admin.

`POST /admin/setup` — public, but requires `secretKey` matching `ADMIN_SETUP_KEY`. Creates the first admin. Disable after first use.

## Drivers

`GET /drivers` — public. Returns active drivers (name, phone, vehicle number, status only).

`GET /drivers/:uid` — admin only. Full driver profile.

`PUT /drivers/:uid` — admin only. Update driver fields.

`PATCH /drivers/:uid/status` — admin only. Body: `{ isActive: boolean }`. Enable/disable a driver account.

`DELETE /drivers/:uid` — admin only. Permanently deletes the driver.

`GET /drivers/:uid/rides` — driver (own) or admin. Ride history.

## Vehicles

`GET /vehicles` — public.

`POST /vehicles` — admin only. Body: `{ vehicleNumber, model, capacity, color, assignedDriverUid }`

`PUT /vehicles/:id` — admin only.

`DELETE /vehicles/:id` — admin only.

## Pickup requests

`POST /requests` — public (students, no login). Body: `{ studentName, studentPhone, pickupLocation: {lat, lng}, targetDriverUid, notes }`

`PATCH /requests/:id/status` — driver only. Body: `{ status: "accepted" | "declined" | "completed" }`

`GET /requests/driver/:uid` — driver only. Pending requests for that driver.

## Admin

`GET /admin/stats` — admin only. Dashboard summary counts.

`GET /admin/rides` — admin only. Query params: `limit`, `startDate`.

## Response shape

All endpoints return:

```json
{ "success": true, "data": ... }
```

or on error:

```json
{ "success": false, "error": "message" }
```
