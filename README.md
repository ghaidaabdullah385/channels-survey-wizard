# Survey Configuration Wizard

Front-end assessment for channels by stc.


## Run

```bash
npm install
npm run dev
```

## Notes

- There is no backend. MSW mocks `GET /api/survey-templates` and `POST /api/surveys` (see `src/mocks`).
- The Wi-Fi icon in the header makes the API fail, to test the error and retry states.
- Supports English / Arabic and light / dark mode.

## Stack

React, TypeScript, Vite, Tailwind, shadcn/ui, Zustand, , MSW
