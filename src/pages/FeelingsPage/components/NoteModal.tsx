import React, { useState } from "react";

import ZModal from "@src/common/ZModal";

const NoteModal = ({
  open,
  defaultValue,
  saveNote,
}: {
  open: boolean;
  defaultValue?: string;
  saveNote: (note?: string) => Promise<void>;
}) => {
  const [value, setValue] = useState(defaultValue || "");
  return (
    <ZModal open={open}>
      <p className="m-0 fw-600">Feeling Note</p>
      <form
        onSubmit={async () => {
          await saveNote(value);
        }}
        className="d-flex f-col gap-16"
      >
        <textarea
          className="feeling-note-input simple br-8"
          rows={5}
          cols={32}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <div className="d-flex gap-16 note-modal-actions">
          {defaultValue && (
            <button
              type="button"
              className="simple bg-sec fw-500 br-4"
              onClick={async () => {
                await saveNote();
              }}
            >
              Delete
            </button>
          )}
          <button type="submit" className="simple bg-primary fw-500 br-4">
            Save
          </button>
        </div>
      </form>
    </ZModal>
  );
};

export default NoteModal;
