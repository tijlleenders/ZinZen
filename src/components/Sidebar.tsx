// # TODO: This component is no longer in use. Can be removed.

import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import myGroupsIcon from "@assets/images/myGroupsIconLight.svg";
import myGroupsIconFilledLight from "@assets/images/myGroupsIconFilledLight.svg";
import myGroupsIconIconFilledDark from "@assets/images/myGroupsIconFilledDark.svg";

import { t } from "i18next";
import { darkModeState } from "@src/store";
import { displaySidebar } from "@src/store/SidebarState";
import useGlobalStore from "@src/hooks/useGlobalStore";

import "@translations/i18n";

const Sidebar = () => {
  const currentPage = window.location.pathname.split("/")[1];
  const navigate = useNavigate();
  const { handleBackResModal, handleBackLangModal } = useGlobalStore();
  const setShowSidebar = useSetRecoilState(displaySidebar);
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const list = [
    { name: "My Groups", link: "/MyGroups" },
    {
      name: t("blog"),
      link: "https://blog.zinzen.me/",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACdElEQVR4nO2au1IUQRSGPww2QdAQMBLIFYlcCATC9XFAEy8BCvIEAq9AQZkr8hSCD8BaJZi4EGA0Vlv/VHVNObPdQ8/0KPNXddLndO/5pi9nenqhVatWZfUUOAQugSRyuVAsPV+INw0IPskp6z4jYRpcAavAJPE1CawppsR1ZD7L2UA0Tc8Um5lmQ3Uh5wmapwnFNnBxTudiU5W4xndjQVaAXeCkYKu+lH0HWC7PUA3ILHBUcgs1i3XGJZiqQRaAH/L7DrwAHgKjOf6mfg54CZypnWnfdQmoKpBZC2IPGMNP48C+BTMdC+TIghihnG4BB+rnUwyQFWs6+Y5EVneAc/W3VDfIrmxmTdjqAFvAt5zF3Qc25WfrlezbdYN8le1Bpv6d4261kWk3p/qTukEGsmWnVV/13YJdLh0ZW2M+rxwhQfJsKYgJ+G9alP20oK3rVlwpyKbj1Hrr0Lafs55qAenox9Onmy2nguh4tN2IARJS3Zz19M+BBIuhBfkfRqQzJLP7ZPuoIK6Z3SXbRwXxTWpF2b4WkGGvKHmZ3Sfbjw95bQn60mhOg2Uyu0u2f6T64ypBdmQzR1afzO6T7V/L/r5KkGXZzjQFQuuudYx+UiI+L8dD2fd1ZA0l09cH9f3xGvE5O85YT+1AR9YQI5FCmOPv/WvE5+XYtWDOdWQ1i/S2R/Bm55vXmrD7ehwgPi/HaX0BSQIVM52KRqIykFRL+nhwbH3JdynG94va5i3sWkHqVnLjQAZybMKVW1b3FNtPHJTmCXNn1zQ997l668n5Snd2U8TXlCB+KTbna+r1gNtqtOvpVD0Noc+W2rg/DLRq1Yo/+g2kbEze1vccAgAAAABJRU5ErkJggg==",
    },
    {
      name: t("donate"),
      link: "https://donate.stripe.com/6oE4jK1iPcPT1m89AA",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEoElEQVR4nNWaa4hVVRTHf6PZKPmYGpGmJipkykdEpJSlHyqjgoosi0gsIbUIygLLLHpYEEUSFNKH7PUhyIjSaAory5KiFxWIppkpFWqJzpTa9MBpbiz4H1gc7j33nn3OPWf6w4GZOXuvtdfee631X+sMFI92YCmwBdgGfAisAOYBnfwPcBbwHPAnUEl4NgMPAF0MIkwAHgK2u4X+C3QDFwNnA9cB9wFvAr+5cQPAOxpXCo4HFgNfx3Z6F7AcGJ8wdyhwAfAMcMDN/Qg4vYjFtwHzgfXa8WgBPcBK4DxgSEqZY4C73SkdBu5qxuKPAGYBq4G/3eLNB1YBlwNH5qBnHPCKk/9swKZUxShgGbDHCe8H1iny2PtmYLH8xvQ9nFXYMcBGZ8AmKTiOYnCvu2YnhwoZoihigrYC0ykeK6T/QJacs1RC9tWJPM3CQuk35z8nVMgZwD+6oxdSDhvokSFXhgoZrmxrQp6iHCyXfkuawXhMQr4DRlA8RrpcMjVUyCm6UpbkplEOFrrsHoy3JcTIXj1YCJ5I/tigNcwNFXCpixKWXZMwGvhJJ/cCcBFwAnA0cCIwQzt7Rco1nKQAcwg4KtSQiPTd3sDYVx1jTaLo/Slpy/2a91KoEdMkYH8dB28BntTYP4DTgBuBNWIAu4E+Z8iDKdbQ4ui/3Y4gLJKA5+vE9lWOMhiBrEbp9wSG7ukuAQ8jEHMlxAqgOOxqvOh2ukc+EUcr8KXGrFWtkQYrNddOPBjHynH7qjhZ5IAVObadTBIv+l71Shq0Awc1P3NB9YkEXVvl3Rq9u6PG3NmuNglZyKOa/x454DYJs8Ipjlk1KEObqrjf9X5BgN4uBY5KFnLo0aHr9ZfKTo9OKdotX2iVAb55kBQoaqHVhf2XyRHrauSSFvWk7N1rwE6XR7rFkG1MGpgvRvXOD1U2LxOuluDtVerkc2PJzrjQlEA9lv0/l5y9zeiYWPz+RQoui/lCt6vWrg84AbQ5892V/BE4lSbhESn5TL+PcflhU2BH0Ay4CvjGnegbCaE8F3S6ds8lLlFtbYBMVpNlXcUdzoCfgTkUhKddcdWvSJambj9TO97vDLAAcWvRxVpnrAn3eIPzzG/ucQZYOH9L/pZLky3LqVQabAWNcKQyCs3nUzKGAV+4RVUjifET/EpjD7rgsDFLgZQHljm6XlEJXIvNXgP86hLbZEW6b/U3+8xQCtrEnQZU4OzVgl533b4W8aKICdjzQSycznAnNLYMQ25xNYVhpqPYAwql+50BRv2X1DixdzOQycyIKLtl7wiTVKcfjn3IeaJOQ3uBxprMwrFTysfXqBa7UiTGCZJlhLNw9El5HolrlGRZe6dwHJJya11mxWhHNAvHNinPg5VOdFSncKyWcusUZsXNLnQXjnlS/n4OstZL1g2UlBB7tYAsXGmmZPTmXcamwRJHvccGfkSN2p/28bQ0DHc19ccpK7l21yP7VJ2SUtGhTwcRGbR/tWjkOu1w9bh1MAcFOlS7e2J4k8LqSD2TFJ0ix45OYtAYEcGuxp0uACQ9vfKJ0q8TCbBoZqHZ8ow1IowB2GM/W56wEFtYdPoPHOeKijMjTzUAAAAASUVORK5CYII=",
    },
    {
      name: t("feedback"),
      link: "/Feedback",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAABG0lEQVR4nO3WPUoDQRjG8b+1TXA3BARPYKeVYKrkALGwFUGw2c5GvIMXsPYY3mD7TVKFgCDYLOQCGRnY4mXd1WGcj0XmgaebyftjZjcspKT8PVPgGXjxWP37l79B7oA9oAJUz7n9CfMZCKKafvRBMrFoC8w99l3MGnVhxmJBhd+sxayjhHF5MjPg2qJ6XzsrMSuzwZSWb4ze5/xkyiFhniz/bfU+59fkMv8LcwM8GvTMALMUs3KfD3BhgAn2ahchMFfAvUFPQ1yTyySM9cnkYsEGOPfQk2ZWJWbpx+NbDoDa82fmDrgwweg8eMaoBlSbYHQWwCvw5rjyu1eZYnxl0rqeqJg+UDRMFygqpg2KjpGgQWAAjoHD2IjOfAGj8V95qRszdgAAAABJRU5ErkJggg==",
    },
    {
      name: t("privacy"),
      link: "/ZinZenFAQ",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAErklEQVR4nNWaa4hVVRTHf3d81NhYmb0Ro+wxRUEPbBjKXmAPxNfYh/pQWVFRhL2D6kNWGkaF0Qsi/NIbLVLpaWRoEAYR2FBpNdCDSihTmx7qOHNj0f/EdjfnnH32uefO+IcD997zX2vt59prrX2hGowHbgBWAp/rsc/XAwewB2A8sAj4E6inPNuBZ4BDGYYYBywAep0GrwbmAicCJwFXAh8473slY7LDYgYeALY6DXwb6MiQ6RAn4W+VDtPVdBwLPObNwLtAZwEdnZJJ5H8HFgPHUDFagTnAO8CAjA9oE2fNQB46pCPR2a8Z65LNhmAfYAbwokYsGb1twBPA8Y0yJF1PSrc7Sy8A09WWYIwGpgDzgbXADkfpLmAVcBXQRnUYKxvvyWZif4fadK/aaG1Nxd+eq/wDeENnwsE0H4fI9ptqi9s2a2sqkhl4BDgnr9dNxmjgXLUtOY9S8ZtIE0oatcPuIaBbnm2LvrdQHhPUxl+zSD+IVGYTn+1tWPfZADwI7FdC/wnS9V0WaYNIse70MGdWlwGnAWO0TL93OtRdwmF0SofFb6n4RKSpkUYelvz7QC1lyXWLc3ekjQsk/3EWabVIdvDFIJnRszI4s8X5NNLGJU4olIolIt0c6f/75RZHZfDadIpvj9z8d6mNdnim4p4QUgpOluz6AO4mcQ+PsLNEsrdkkS4VyeKpojhDsh8GcL8Qtz3CzhrJWtiSig6ReiIMnO9EwXlInMqpEXZ+lKy54VSM0/rdFRF5zpKB5QHcteKeWdDGQWqf7cO9GuF5BsNcyT0XwH1L3GmRg7WmyGayjV8E90luYQD3KXFvizynFoaQrw7x04Ogu8BMXijuZwVtfCS5i0LI7U4uPaKAkW8k96wiAwtNfIxRJ54X9+sC+vdXdN4XGqvVFJDVFSOFostLhMzF+vjSef9X6MgKl0nOEq5gPCqhp4sIAROdjbxzkPc79e6ViKrJcsleGxNhbgpcXiM1I0msVleVxcfjXt2rS7J5aNMM2rI6sEhHak5ucl6AS/zKK0zcnjIA9tsdXr6yEZiZY+OaAoft/7BIwkszOPOdMo515kYFj3kYK24yAAMqKqRhvXg2g4UxUVPZp88+ZjjVjXmBS8SHydzk7J1pKRlnEjYV8aK7YZmUWL7tI6njmmMoi8VOQuZjRYnU4j9MkZItXrG5llNxj316vczydC27zcC+lETiiSw8cLGugo6s82ys0u/mPEpjshNxHkHzMFWd+BbYu1FKX3YOsmagVeFLXSd6w3CkU7K0c6NqLMipxpTCPCn/qeJ7wMlyxzZwR1VhoMXJ7F6rYqT4N6rtkQ0buMowSa7YDN3ZYN02MEule2VFA7UbpsuL9ZWoSGZlmD3NvCC937lRiqmE+Lhcg9MLnEITUVORIQn1jyuha45m1za4ZY9NxyjdJFlnfs6rM6XgYnWgX7MyZGh1MsJfFKmG4lZ1oF8FjyGHXYm96qS31+XwR+hGOOFfwTBCi07jASfXb025CEr+JLA5IPscMsxy0tiNXkl0tpZfXdXMyv/hUBbtKrzVtf7twv91J1RfoRrVHoGRSmHdu/FtRUs5DCMcDbykv4CUvfLOxD8NjrBBvwyklwAAAABJRU5ErkJggg==",
    },
    {
      name: "Invest",
      link: "/Invest",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAACyklEQVR4nMXXW4iWVRQG4GcqsHKC7MKKrMgKIehAaTeBVxESDQWiXUhhdJKSwkqbjkQkBTEqQVhJFGoF3ihpXRQYaIVRSdGFdqIBKSvLwgoPFCMb3h8+fmZkJvc388Li+/bea//f+++91rvX5vhwCRZgMW7BDBOAPnyJv7AVG/ABDuAL3DAeJHqwEr9iKR7BFnya56N4KOMr4t8ansY3uAu/4T3cjRuxCO9jH+7A13iqLSKX4W/cnu2YN4Lf/IwvzLPMq4512aJduKdrrKxOE/fiq/i/XptID/7E/diDE9M/Ff9gKKvWm/4y/iPuwx+1yZyF/7AMbzT6L8JhPIw7uwL2rQR5mXd2TTLn4yAew5pG/2nJohK4/2J6Y+zV+Jd502qSOTUfW4IPG/2TsbFB5sLG2I74H8EpKuNjPBihuzR9J0R5d+ZZ2gVXxK9ozkdawMJk0vKo7JQR/M5IJhVN2o1b2yBzEj7BaryJ7zAXkzJ+cjTme6zHS1nNMq8VnJePrcuWlX9+CD8lq3YlTtaHbPFvFWdiE37Hi3ggqb0k7f0ZL37jhquxKtlVRG972qV/wtAbMnMj/y932XUTQeaXkHmuYdu6RLIankw8NO3nFFaFzDVJ91WJmYLH2yKzBgOR/I5djrdDZllqnNK+OHNeyApVxyt4Iu/PRwSL4p4bMgeSVVdhZsqKctJf2QaZpXgn79fj25Sbc0Lmh2hQx7a2Gbynp+Tclix5LefPUKxTy4wbelN2PtvImBUhczPWtrk1Y0ntUoA/k6BuFRfg2hGsL2T6juFT5lfDJgzis/9hgw3dqYLN6O/SmNFaf+ZXFbyh47CiUVWxqKEzo8W7w9ypqmBWzqKxYG/UuDompZo7Z5T+0+LfKUurY2cu+aPBTfi81ocHUh40rVxty82gu384K37Fv9O+LQV7+d0xo1wxyilcy2anJC33q2FxFLqr4pWrT6gFAAAAAElFTkSuQmCC",
    },
    {
      name: "Backup / Restore",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACx0lEQVR4nO2Zy2sUQRCHv+gagy4kEVEUc9CLQTyqiOIDEfRkNBh8oBcP4h8geNJLPHnyDxA1IujBkyjEQ9TEoPjWa5AIEY3Po/hY40rHWliKmh1mpnvckXzQsKR3f1U1XV3TXYEZ/n/2AJPAJ2AvBWMfUAGqMlwQhXW+CrynwM5XgF4KwG7DeTc+A+eBo0AXTcyk4bwev4GbwHYKGkD9eAaszdPBOcAB4DAwNyKFfiUMogKcBlpDO98B3K0zfC3ie/sj9sEo8LhBIHeAcijnO4GXyuAPoCVBEBMytxK4AkwZQdyXB+UVlyojhrFbMb/TQbxT8+uAcUP3HlDyGcBZw8iIrEocPcBrefq7jPkOYNDQ7/fl/DYpezpX23wZ4K/WkLLh0mtzVuHZwAsl/Apoxz9lYEzZephVtM94KusJxwajBO/IIqg37gDhuaBsurKdii6V++5zN+HpVuXVfV6URuiYehLD5MeIsn0wjciAEjlOfpzykbrPlUjmkpaALcr20zQiH5XIYvJjhbKd6ir6XYlYJ89QzDfOXIn5qUScaF60Kdvf0oh8USLLyY8lPpoB/3ITb1W2n6QRuaRETpIfJ5Rt93ZOzCHj+JwXo8q262QkZqF6pbujxGrCs8o4wixLKzbsYykTctm4e6RmpxJzR92NhGOTcXnK3M17pATHAnUOFsjVUx8hZvk4l+juwZDnK+U8Y+NOyYp4od+4dA9GtD/6pA/6VppccXQazrtxBo+UItoq49IaqdEiB6/afEU61Y24YejeDtGla5emU9VY6qt1t7UPaj4uiK9G3odoGkxTlrKmg6h/5T8w/t4oiIuqZAZzvkar7Amr99loVCL2RElKZa/vblwca2S5kwShW4tNgevcXY9o1BYigBpLgSPAOSmjVgq5PmnT0xPxD764cto0vCmy80ieF9b5WgpNyFu6EDk/Axn4A0qzpuaA2jjxAAAAAElFTkSuQmCC",
    },
    {
      name: "Theme",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB9klEQVR4nN3WTYiNURzH8Y+ZvDYjikEMyoIFCzbyUqPIQrFAVkTeoslrWbAxeWmuLBALOwslFlaiJFlQGC8pG0kI2UjsbHXqv3g63av0nDvJr249nXM633v+z+//Ow//uaZh1nACR+A43uMTBoYDOgbXcBvd8fuJznZCJ+MRLlZAS/G2ndB5AdhfGZuJj1jeLuhKfMbaylgq8StsaRd0Oz5gUWUslflWGKwtzh2IU/Vmc5dwPda0xbl3oqRVHcJDjC4NnYohXEBHNrcmDNZTGjof79DfZG5hhMXcUrAO9GFzbLy6yZoZYbAVpaDT8RT3ol0Gm6zpwktsKwVdHKfYha2YgtfY26RtTpeKvRv4hVU4GK0hTFOFn4+1RdpmH67EpvcxPjbehKMV+E08xti6wJERbw/wPZLobMDH4RxmY0K8+x+YUxfaG72ZyrYR68PBObwn2imF/hdMrAMdhWfYkY2faHLyZLBlUeZT9c7Khtioqt14ErGYwxvh5Dy1/lqD2JONdUbWpk+XnZWyX8abMFxtnYlezZWAV+P5cJjpRXbR19IxHGnxRTEpnhvxzvtKXnUnceAP812RYPmdW1tDWNJirju+FlNViqo/nJorOXZdJFSjhINzpXb5FmGQ2ucunuNr/KFi15wWSsGwIEqeLvsi7fJP6TcEbWQVye9EogAAAABJRU5ErkJggg==",
    },
  ];
  const toggleTheme = () => {
    setDarkModeStatus(!darkModeStatus);
    if (darkModeStatus) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="sidebar">
      {list.map((ele) => {
        const src = ele.src
          ? ele.src
          : currentPage !== "MyGroups"
          ? myGroupsIcon
          : darkModeStatus
          ? myGroupsIconIconFilledDark
          : myGroupsIconFilledLight;
        return (
          <button
            key={ele.name}
            type="button"
            className={`sidebar-item${darkModeStatus ? "-dark" : ""}`}
            style={{ color: darkModeStatus ? "white" : "black" }}
            onClick={async () => {
              setShowSidebar(false);
              if (ele.name === "Theme") {
                toggleTheme();
              } else if (ele.name === "Backup / Restore") {
                handleBackResModal();
              } else if (ele.name === t("changeLanguage")) {
                handleBackLangModal();
              } else if (ele.link) {
                if (ele.link.includes("http")) {
                  window.open(ele.link, "_self");
                } else navigate(ele.link);
              }
            }}
          >
            {ele.name}
            <button type="button" className={`${darkModeStatus ? "dark" : "light"}-svg-bg`}>
              <img
                className={ele.src ? `${darkModeStatus ? "dark" : "light"}-svg` : `${darkModeStatus ? "dark-svg" : ""}`}
                alt="create-goals-suggestion"
                src={src}
                width={24}
              />
            </button>
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
