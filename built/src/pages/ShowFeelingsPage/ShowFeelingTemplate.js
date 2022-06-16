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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowFeelingTemplate = void 0;
// @ts-nocheck
/* eslint-disable react/prop-types */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const recoil_1 = require("recoil");
const react_i18next_1 = require("react-i18next");
const react_bootstrap_icons_1 = require("react-bootstrap-icons");
const _store_1 = require("@store");
const FeelingsAPI_1 = require("@api/FeelingsAPI");
const FeelingsList_1 = require("@consts/FeelingsList");
require("@translations/i18n");
require("./ShowFeelingsPage.scss");
const ShowFeelingTemplate = ({ feelingsListObject, setFeelingsListObject, currentFeelingsList, handleFocus, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const darkModeStatus = (0, recoil_1.useRecoilValue)(_store_1.darkModeState);
    const [showInputModal, setShowInputModal] = (0, react_1.useState)(false);
    const [showNotesModal, setShowNotesModal] = (0, react_1.useState)(false);
    const [selectedFeelingNote, setSelectedFeelingNote] = (0, react_1.useState)("");
    const [noteValue, setNoteValue] = (0, react_1.useState)("");
    const handleInputClose = () => setShowInputModal(false);
    const handleInputShow = () => setShowInputModal(true);
    const handleNotesClose = () => setShowNotesModal(false);
    const handleNotesShow = () => setShowNotesModal(true);
    const handleFeelingsNoteModify = async () => {
        (0, FeelingsAPI_1.addFeelingNote)(handleFocus.selectedFeeling, noteValue).then((newFeelingsList) => {
            const feelingsByDates = newFeelingsList.reduce((dates, feeling) => {
                if (dates[feeling.date]) {
                    dates[feeling.date].push(feeling);
                }
                else {
                    // eslint-disable-next-line no-param-reassign
                    dates[feeling.date] = [feeling];
                }
                return dates;
            }, {});
            setFeelingsListObject.setFeelingsList({ ...feelingsByDates });
        });
    };
    const handleFeelingClick = (id) => {
        handleFocus.setSelectedFeeling(handleFocus.selectedFeeling === id ? -1 : id);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            react_1.default.createElement("div", null, feelingsListObject &&
                Object.keys(feelingsListObject).map((feelingId) => (react_1.default.createElement(react_bootstrap_1.Button, { key: feelingsListObject[Number(feelingId)].content + feelingsListObject[Number(feelingId)].date, className: darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "show-btn-my-feelings-light", size: "lg" },
                    react_1.default.createElement("div", { className: "btn-my-feelings_container", "aria-hidden": "true", onClick: () => {
                            handleFeelingClick(feelingsListObject[Number(feelingId)].id);
                        } },
                        react_1.default.createElement("div", null,
                            FeelingsList_1.feelingsEmojis[feelingsListObject[Number(feelingId)].category],
                            react_1.default.createElement("span", { className: "btn-my-feelings__text" }, t(feelingsListObject[Number(feelingId)].content))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null, handleFocus.selectedFeeling === feelingsListObject[Number(feelingId)].id ? (react_1.default.createElement(react_bootstrap_icons_1.ChevronDown, null)) : (react_1.default.createElement(react_bootstrap_icons_1.ChevronRight, null))))),
                    feelingsListObject[Number(feelingId)]?.note && (react_1.default.createElement("span", { "aria-hidden": "true", className: "btn-my-feelings__note", onClick: () => {
                            handleFeelingClick(feelingsListObject[Number(feelingId)].id);
                        } }, handleFocus.selectedFeeling === feelingsListObject[Number(feelingId)].id
                        ? `${feelingsListObject[Number(feelingId)].note}`
                        : "...")),
                    handleFocus.selectedFeeling === feelingsListObject[Number(feelingId)].id && (react_1.default.createElement("div", { className: "show-feelings__options" },
                        react_1.default.createElement(react_bootstrap_icons_1.TrashFill, { onClick: () => {
                                const numFeelingId = feelingsListObject[Number(feelingId)].id;
                                if (numFeelingId !== undefined) {
                                    (0, FeelingsAPI_1.removeFeeling)(numFeelingId);
                                }
                                else {
                                    console.log("Attempting to remove feeling not in the database");
                                }
                                const newFeelingsList = currentFeelingsList;
                                const feelingDate = feelingsListObject[Number(feelingId)].date;
                                newFeelingsList[feelingDate] = currentFeelingsList[feelingDate].filter((feelingOnDate) => feelingOnDate.id !== numFeelingId);
                                setFeelingsListObject.setFeelingsList({ ...newFeelingsList });
                            }, size: 20 }),
                        react_1.default.createElement(react_bootstrap_icons_1.Journal, { onClick: () => {
                                if (feelingsListObject[Number(feelingId)]?.note) {
                                    setSelectedFeelingNote(feelingsListObject[Number(feelingId)]?.note);
                                }
                                if (feelingsListObject[Number(feelingId)]?.note) {
                                    handleNotesShow();
                                }
                                else {
                                    handleInputShow();
                                }
                            }, size: 20 }))))))),
            react_1.default.createElement(react_bootstrap_1.Modal, { show: showInputModal, onHide: handleInputClose, centered: true, autoFocus: false, className: darkModeStatus ? "notes-modal-dark" : "notes-modal-light" },
                react_1.default.createElement(react_bootstrap_1.Modal.Header, { closeButton: true },
                    react_1.default.createElement(react_bootstrap_1.Modal.Title, { className: darkModeStatus ? "note-modal-title-dark" : "note-modal-title-light" }, "Want to tell more about it?")),
                react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
                    react_1.default.createElement("input", { 
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus: true, type: "text", placeholder: "Add a reason", className: "show-feelings__note-input", value: noteValue, onChange: (e) => {
                            setNoteValue(e.target.value);
                        }, 
                        // Admittedly not the best way to do this but suffices for now
                        onKeyDown: (e) => {
                            if (e.key === "Enter") {
                                handleFeelingsNoteModify();
                                setNoteValue("");
                                handleInputClose();
                            }
                        } })),
                react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", type: "submit", onClick: () => {
                            handleFeelingsNoteModify();
                            setNoteValue("");
                            handleInputClose();
                        }, className: "show-feelings__modal-button" }, "Done"))),
            react_1.default.createElement(react_bootstrap_1.Modal, { show: showNotesModal, onHide: handleNotesClose, centered: true, className: darkModeStatus ? "notes-modal-dark" : "notes-modal-light" },
                react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
                    react_1.default.createElement("textarea", { readOnly: true, className: "show-feeling__note-textarea", rows: 5, cols: 32, value: selectedFeelingNote })),
                react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: async () => {
                            const newFeelingsList = await (0, FeelingsAPI_1.removeFeelingNote)(handleFocus.selectedFeeling);
                            const feelingsByDates = newFeelingsList.reduce((dates, feeling) => {
                                if (dates[feeling.date]) {
                                    dates[feeling.date].push(feeling);
                                }
                                else {
                                    // eslint-disable-next-line no-param-reassign
                                    dates[feeling.date] = [feeling];
                                }
                                return dates;
                            }, {});
                            setFeelingsListObject.setFeelingsList({ ...feelingsByDates });
                            handleNotesClose();
                        }, className: "show-feelings__modal-button" }, "Delete"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: handleNotesClose, className: "show-feelings__modal-button" }, "Done"))))));
};
exports.ShowFeelingTemplate = ShowFeelingTemplate;
