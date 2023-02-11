import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { addPublicGroup, deleteGroup, getPublicGroup } from "@src/api/PublicGroupsAPI";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { darkModeState, lastAction } from "@src/store";
import { displayExploreGroups, displayGroup } from "@src/store/GroupsState";

interface MyGroupProps {
  group: PublicGroupItem,
}
const MyGroup = ({ group }: MyGroupProps) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const openExploreGroups = useRecoilValue(displayExploreGroups);

  const setLastAction = useSetRecoilState(lastAction);
  const setSelectedGroup = useSetRecoilState(displayGroup);

  return (
    <div
      key={String(`goal-${group.id}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""}`}
    >
      <div className="goal-dropdown">
        { group.polls.length > 0 && (
          <div
            className="goal-dd-outer"
            style={{ borderColor: group.groupColor }}
          />
        )}
        <div
          className="goal-dd-inner"
          style={{
            height: "80%",
            background: `radial-gradient(50% 50% at 50% 50%, ${group.groupColor}33 79.17%, ${group.groupColor} 100%)`
          }}
        />
      </div>
      <button
        type="button"
        className="user-goal-main"
        onClick={async () => {
          setSelectedGroup({ ...(openExploreGroups ? group : await getPublicGroup(group.id)) });
        }}
      >
        <div
          aria-hidden
          className="goal-title"
          suppressContentEditableWarning
        >
          <div>{group.title}</div>&nbsp;
        </div>
        <button
          type="button"
          className="contact-button"
          style={{
            background: "transparent",
            border: "none",
            top: "15px",
            ...(darkModeStatus ? { filter: "invert(1)" } : { opacity: "0.6" })
          }}
          onClickCapture={async (e) => {
            e.stopPropagation();
            await (openExploreGroups ? addPublicGroup(group) : deleteGroup(group.id));
            setLastAction(openExploreGroups ? "groupDeleted" : "groupAdded");
          }}
        >
          { openExploreGroups ?
            <img alt="join public group" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAACj0lEQVR4nO2X32tOcRzHX/Zg1ma2FPlRFLsQy8WUFhd+E+UPIK5kK2TRkiuNuaBdLS6GUty4Ejd6Shq1tjElPaLkwiL2SCaK8tgefet96uz0Pb/PYyWf+lw83+/7nM/r+Z7P53M+B/5bfFsLXAOGgDxwBJht0S0GLgIDwCOgC5hPhrYP+AWUPT4I1Ll0LcBni+4d0JQFyDLgpyWA45ekmwW8CdANZwFzOiCA8W/ATGBbiM74mrQwfRGCLAIORdDtTQtzJiSAeYTVwJ4IMCanUtkq4HdAgJvS1QAfAnQvgSoysJPApCXAa2CBS7fdJ9m/AuvI0HYB94GPwCvgAtBg0TUDt1TOb4HrwAr+NdsA9KiibN4u3UqgO0DnuCmGJUlATBlOhFTHZoF8j1BJjheBhXFh8iE3LQFzgHMxQBw/FhfmWcgNx6W7kgCmezphikAvsEMvzJrpgClphKhTw1sPHAZOAW1Aa9RGmBZmHNiqYOa9Neqje6+qzFUKpqS3eC1w17L/2FKp94D6SsB06UTuWPYKum7Yspf3O6GkMEXliN9I8UTX9fvsH7XBPAyBKenfn/Ws92p9NCHMmIa1KXY5QskuB/Z71naqasoJYYxv8sJsjADTBswFvrjWmlS+zu8XwFOX39D9+zzrBdeYctz2qG6HwBT0SDpdaw2uudlUTRzrD+rQ84CREKATwAzgqn4v1YmVVb6DmoMcd74mejzrA65y7/CjNa3bDFI/LCAjepwI6IDm3NaUObMl7Ahrgd3Kh4PA6gBtlTprEphP+gbL1NoTwliTN63l1OK9wZ5rf8iy98DWY7KyesuQNqlTmbCANFJhy6nFjwXkSEclTwSLmWBmZjY5cV4AZsT4qxCJ7Q8siwq3/II50gAAAABJRU5ErkJggg==" />
            : <img alt="leave public group" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAACK0lEQVR4nO2Yz0tVQRTHP1QapaBStMpy0SLBKAldu3DhrgQX/Q2iixYvNw/ShZG7IkSklZuSFCHIXJSCIEQQFKKLlAeS/RRX5cIsKwbOg+Ew45v37twuRAe+m3nzZj5v7pzvOffB/4gfLcA6UEioyRgwdcBN4HYCLQEfiBzHgMMVfG8wJkwTMA/8BHaAO8DRLGCOAG+A30q3soBpdYAYvfPMvyw/IBWYNg/MJ8fc48AuMAVUpQFTLamtYe555l8BviugqBf4ArBigRjPqLUe44DSgjWvbJh2YA54pfQCmAH6xG9MVjWo7/Y5DO6zwHyUkw2GaQC+eO6FrW2gJ2C9E5J9W+LeZZ3MaABIUb+A/gPWMqfwWoEEw7SKkdkZ8sjjKyFABua+AgmGWVQbXZXxxwEnZO5KaJSEMca0b20wK+OngD0HwJ4DqHhh3wK5JDAmJmThTeCsjF33nMaw6KATa0wCY+KcPOtiuO7LD2sjH9BXoB53VGR6lzwbTat514AxYFx0V7yKmDB5D0xHuQvFgMk5QJYTglQEcwY46XDjglTjvwbTKP2JSetOZYRGI2nBmGrbq6rsnGz6XHrcvCObLqYBM13CK4aAQ8BTNf5SxqPCrJaAuWFV3w31WX9smG6pqi67f6AMsE3aSNvYTseEKTd6FfSTLGHsGqareyYwNaoHfp/VS1wxzgPfLKBm6YtzjoZc61ka79pdUh5GJc1NR7cW+C/Ew9gw/HPxByp4QRNrIFTOAAAAAElFTkSuQmCC" /> }
        </button>

      </button>
    </div>
  );
};

export default MyGroup;
