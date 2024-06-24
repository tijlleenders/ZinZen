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
      <p style={{ fontWeight: 600, margin: 0 }}>Feeling Note</p>
      <form
        onSubmit={async () => {
          await saveNote(value);
        }}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <textarea
          className="feeling-note-input simple"
          rows={5}
          cols={32}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <div className="note-modal-actions">
          {defaultValue && (
            <button
              type="button"
              className="simple bg-sec"
              onClick={async () => {
                await saveNote();
              }}
            >
              Delete
            </button>
          )}
          <button type="submit" className="simple bg-primary">
            Save
          </button>
        </div>
      </form>
    </ZModal>
  );
};

export default NoteModal;
