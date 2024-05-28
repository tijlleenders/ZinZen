import React from "react";
import { Transaction } from "dexie";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { db } from "@models";
import ZModal from "@src/common/ZModal";
import { syncVersion } from "@src/models/dexie";
import { backupRestoreModal, darkModeState, displayToast, lastAction } from "@src/store";

import "dexie-export-import";
import "./index.scss";

const backupImg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADB0lEQVR4nO2Z3YtMYRzHP3a9jpc21sxQ5C1FFFHakJeibd24EQnXe4H2brkTpVUU+QMWiVLWhfdEsSHvNizLtkoJid3FLlvs6Nm+R481M7szc87OeTSfOs0855zn9/y+53n7nd+BAgUKhIHBwAJgE7Ad2AqsBRYCxTjAIuAI8BVIpDg+ArVAGSFkAnAK6LYcfg6cAA4Bh4E64FkvUXXAdELCcuC9HPsM7AYmpbl/BrALaFedVqCcPLMa+C6HTgLRDOqOV4+Zuj+BLeSJ2cA3ObIzSxuDVNcMyS5gCQER0UqzUkPCYwjwVCL2+NDOXtkyQ7QEH5kGHAc6e03ORmAdUKXydaDIh/aKgKuyWYNPlFsT0YzdR8A14LUlyAyFX8AsvxoF5smmeXgxP4x1yNlaLas2ZRLmLZ1+c0a2K3M1dFOG9vUxbyr9eGpJ2Kz2L5ID82XklSZzPojKh0+5GKnycRXKhU75MSKbykuB+zKQt41JtMiPqWRAzJpgXkBn7xf54K18OQCsAYb2VWGmtaS2aKJl1Z0+86TX3vUBqE41b8cBzbrxNDCK8DAGWAxs1KbcJT/vJovljuni5TyuUP3FRBm3rcjCCP0T7HVr956IGwxXOJRQL/WwXycO4hZx4Is6wUQgPJCQZbhHjd0JrSqMDagxMwTuBZgTSGhl44cKwwJqzFs2g6BEtttM4Y0K6d6rwypkpGybN1OuqLDeQSFzZPulKWxT4ayDQqqtdyVKrTdAk8pxRUjEisMqvJM7dOIdMMURIUdl95ayLz2Y/OsFS8yKEAuJWCLaFZn8xWjgvNXwOWADMLk/oXPAQiLAXM0JbziZXX1VqgrFurktTdI51VGfhZD6LNpJaDj90xPJKFXq/5L2GS90TnfcCFBIB9Ck1anCnhMDSZDL74BSEBI2nOyRh8BjvfSkEmKuNQB3CDEN1me2eBIhcV1LKGccWqLWd5Im5QA8ITHr2gsX8gNx66l7v/Z/u7dCT9R6+vbhRE/0JcZJER5xJdEaXRpO6Xomk8/UBfgf+A3SSyxFIXLo1QAAAABJRU5ErkJggg==";
const restoreImg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADnUlEQVR4nO2ay05UQRCGPyMMkyg3AVHcyE6jQZ5CQUVBV6hbI1FE5AHEpUFXRl4EMYTERBFBkIuSqAjISmWhxAUaLkIc08l/kg7OMJc+5zBj+JMOM3Sfrq5T1d1Vfw3s4P9FEXARuAf0AjPAN2AVWAN+ANPAE+A+cB4oDXpRo8CrFMblA83AU+A3EEuzbQD9wBWgIAhFPEGJEAE6gAVr7DrwDOiUZY4AFVpgvt7+UaARuKOxq9bzXzVnNCxFzgBz1pgp4GqGblKiZ8et+T4B9QSoiHlTj4A/6nvnp0CgDnhjye72wzqbFdkPjOl/xh1uA3n4j93ALWBZsozMSr8UOQzM6rtxqVqCR41OPU9mtasi5daE47JMWCgFXkr2PHDARZER/X0NFBI+9lhrGMtkz9hn/byrnzqizPIKcwCkhVQvtEHCQY11AJjTzXdFXhAe2q3N7+ulGTbygLdSxiiV0zgtRRZy3Sq7gAkpc4kcxzUp0keOo1T5jYm2i4MWZkL3m7rMfqmZ/KZVKYArnssq5wgQh6zTJV6bBKocZdzVXF0EaAlPifdKZwvVGpXqxrRhXSzTpHkeExDaJOBDAv8ttpS54SDnmOb4SIC5fkyWSPY2U+EEEqFcc3yP1znoQ+z0UwIKk7AtZsySowvHlOT9gzV1uvjuUgqKFAetyKI6TdicKbzcwWzsRLigMcNBudasOg1lkylaNcd0gs1eYuUW14Pa7L0pbNRkiOie8IQ0aU8UyRJ22my4rkzRpHl64nU+UKchz1xQZSkTrxklDgZ5ITaq0zCArojonhjWSWbakNzJxRIeBrTWBhIEYxs6CYwvZyv2WUGjcdm46JemhsbMVrRojYbVT4jLlh9na2I1qTWaKsCWF80XDTxF9uGs1vY5lTJEhxVuGy42m8iHKa3NBKdJERW1HxOhnC3o0Jpm0ikK1euhZZFj241aYEVrOpnuw93WG3CJv1xRYRWWHmYyQdSqiYyIUA4be60cZ9SlzlihmMlj5M33MC++Iasc50ykV1umNW52gnD2xJxkzqrY5AsqLTdbFvcaROktT6fTiuVOvheXotYBEBNbUu/jjW2qxd494W3sQGrvHuo2lacnRGOWZrgPWjaF/bOZHLEu1mm3wpmYItIB/WCgSVlcmUL6iD4fV4LVqbEeT+CFHW1BWyERCsSK9ykFiKXZ1hXFNm+XAvFQrESnSwzgtAiNNbVFEXc9GtOwVT6xA3IcfwEzCVxsbkJcggAAAABJRU5ErkJggg==";

const BackupRestoreModal = () => {
  const open = useRecoilValue(backupRestoreModal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);

  const backupData = async () => {
    const file = await db.export({ prettyJson: true });
    const blob = new Blob([file], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ZinZenBackup-${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importSuccessfull = () => {
    setLastAction("goalsRestored");
    window.history.back();
    setShowToast({ open: true, message: "Data Restored Successfully", extra: "" });
  };

  const restoreData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      reader.onload = async () => {
        if (reader.result) {
          const { data } = JSON.parse(reader.result);
          const currentVersion = data.databaseVersion;
          await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.data.map(async (table: { tableName: string; rows: readonly any[] }) => {
              try {
                const dbTable = db.table(table.tableName);
                await dbTable.bulkPut(table.rows.map((ele) => (ele.$ ? ele.$ : ele))).catch((err) => console.log(err));
              } catch (err) {
                console.log(err);
              }
            }),
          );
          db.transaction("rw", db.tables, async (transaction: Transaction) => {
            syncVersion(transaction, currentVersion);
          });
          importSuccessfull();
        } else {
          setShowToast({
            open: true,
            message: "The backup file is either corrupted or doesn't contain the data",
            extra: "",
          });
        }
      };
    } catch (error) {
      console.error(error);
      setShowToast({ open: true, message: "Failed to restore the data", extra: error.message });
    }
  };

  const getOption = (text: "Backup" | "Restore") => (
    <button
      type="button"
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
      onClick={async () => {
        if (text === "Backup") {
          await backupData();
          window.history.back();
        } else {
          document.getElementById("backupFileInput")?.click();
        }
      }}
    >
      <img className="secondary-icon" alt={`${text} data`} src={text === "Backup" ? backupImg : restoreImg} />
      <p>{text}</p>
    </button>
  );
  return (
    <ZModal open={open} onCancel={() => window.history.back()} type="backupRestoreModal">
      <p className="popupModal-title" style={{ textAlign: "center" }}>
        {" "}
        Choose an option from below
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "60px" }}>
        {getOption("Backup")}
        {getOption("Restore")}
      </div>
      <input type="file" id="backupFileInput" style={{ display: "none" }} onChange={restoreData} />
    </ZModal>
  );
};

export default BackupRestoreModal;
