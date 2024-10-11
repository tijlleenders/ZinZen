import { IconProps } from "@src/Interfaces/ICommon";
import React from "react";

const Icon: React.FC<IconProps> = ({ title, active }) => {
  const color1 = active ? "var(--icon-grad-1)" : "#B1B1B1";
  // console.log("🚀 ~ file: Icon.tsx:6 ~ color1:", color1)
  const color2 = active ? "var(--icon-grad-2)" : "#B1B1B1";
  // console.log("🚀 ~ file: Icon.tsx:8 ~ color2:", color2)
  switch (title) {
    case "GoalsIcon":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
          <path
            d="M29.5 15.5C29.5 23.2315 23.232 29.4992 15.5 29.4992C7.76795 29.4992 1.5 23.2315 1.5 15.5C1.5 7.76848 7.76795 1.50076 15.5 1.50076C23.232 1.50076 29.5 7.76848 29.5 15.5Z"
            stroke="url(#paint0_linear_731_1662)"
            strokeWidth="2"
          />
          <path
            d="M27.6913 15.5002C27.6913 22.2335 22.2326 27.6919 15.4989 27.6919C8.76527 27.6919 3.30664 22.2335 3.30664 15.5002C3.30664 8.76696 8.76527 3.30853 15.4989 3.30853C22.2326 3.30853 27.6913 8.76696 27.6913 15.5002Z"
            stroke="url(#paint1_linear_731_1662)"
          />
          <path
            d="M25.2147 15.5007C25.2147 20.8658 20.8655 25.215 15.5005 25.215C10.1354 25.215 5.78613 20.8658 5.78613 15.5007C5.78613 10.1357 10.1354 5.78647 15.5005 5.78647C20.8655 5.78647 25.2147 10.1357 25.2147 15.5007Z"
            stroke="url(#paint2_linear_731_1662)"
            strokeWidth="2"
          />
          <path
            d="M20.0716 15.5008C20.0716 18.0255 18.0249 20.0722 15.5001 20.0722C12.9754 20.0722 10.9287 18.0255 10.9287 15.5008C10.9287 12.976 12.9754 10.9293 15.5001 10.9293C18.0249 10.9293 20.0716 12.976 20.0716 15.5008Z"
            stroke="url(#paint3_linear_731_1662)"
            strokeWidth="2"
          />
          <path
            d="M20.769 15.5004C20.769 18.4103 18.4099 20.7693 15.4997 20.7693C12.5896 20.7693 10.2305 18.4103 10.2305 15.5004C10.2305 12.5905 12.5896 10.2314 15.4997 10.2314C18.4099 10.2314 20.769 12.5905 20.769 15.5004Z"
            stroke="url(#paint4_linear_731_1662)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_731_1662"
              x1="15.5"
              y1="0.500763"
              x2="15.5"
              y2="30.4992"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_731_1662"
              x1="15.499"
              y1="2.80853"
              x2="15.499"
              y2="28.1919"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint2_linear_731_1662"
              x1="15.5004"
              y1="4.78647"
              x2="15.5004"
              y2="26.215"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint3_linear_731_1662"
              x1="15.5001"
              y1="9.92932"
              x2="15.5001"
              y2="21.0722"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint4_linear_731_1662"
              x1="15.4997"
              y1="9.73138"
              x2="15.4997"
              y2="21.2693"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "CalendarIcon":
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="9.07129"
            y="0.5"
            width="1.57143"
            height="7.4375"
            rx="0.785714"
            stroke="url(#paint0_linear_801_730)"
          />
          <rect
            x="19.3574"
            y="0.5"
            width="1.57143"
            height="7.4375"
            rx="0.785714"
            stroke="url(#paint1_linear_801_730)"
          />
          <rect
            x="1.5"
            y="4.3125"
            width="27"
            height="24.1875"
            rx="7.5"
            stroke="url(#paint2_linear_801_730)"
            strokeWidth="3"
          />
          <rect
            x="3.04004"
            y="10.7812"
            width="23.9196"
            height="0.9375"
            stroke="url(#paint3_linear_801_730)"
            strokeWidth="0.9375"
          />
          <defs>
            <linearGradient
              id="paint0_linear_801_730"
              x1="9.857"
              y1="0"
              x2="9.857"
              y2="8.4375"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_801_730"
              x1="20.1431"
              y1="0"
              x2="20.1431"
              y2="8.4375"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint2_linear_801_730"
              x1="15"
              y1="2.8125"
              x2="15"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint3_linear_801_730"
              x1="14.9999"
              y1="10.3125"
              x2="14.9999"
              y2="12.1875"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "JournalIcon":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="23" viewBox="0 0 30 23" fill="none">
          <path
            d="M3.80029 0.744186V1.48837H0.9375C0.419737 1.48837 0 1.82156 0 2.23256V21.5814C0 21.9923 0.419737 22.3256 0.9375 22.3256H29.0625C29.5802 22.3256 30 21.9923 30 21.5814V2.23256C30 1.82156 29.5802 1.48837 29.0625 1.48837H26.1997V0.744186C26.1997 0.333187 25.7799 0 25.2622 0H19.5846C17.8174 0 16.1618 0.602672 15 1.62262C13.8382 0.602672 12.1826 0 10.4155 0H4.73779C4.22003 0 3.80029 0.333187 3.80029 0.744186ZM24.3247 2.17921C24.3231 2.19684 24.3223 2.21462 24.3223 2.23256C24.3223 2.25049 24.3231 2.26828 24.3247 2.2859V17.7729H19.9129C18.4418 17.7729 17.0496 18.1763 15.9375 18.8793V3.09416C16.7368 2.09365 18.1102 1.48837 19.5846 1.48837H24.3247V2.17921ZM26.1997 2.97674H28.125V20.8372H16.1756C17.0222 19.8561 18.4149 19.2613 19.9129 19.2613H25.2622C25.7799 19.2613 26.1997 18.9281 26.1997 18.5171V2.97674ZM10.0871 19.2613C11.585 19.2613 12.9777 19.8561 13.8243 20.8372H1.875V2.97674H3.80029V18.5171C3.80029 18.9281 4.22003 19.2613 4.73779 19.2613H10.0871ZM5.67529 17.7729V2.28589C5.67686 2.26828 5.67767 2.25049 5.67767 2.23256C5.67767 2.21462 5.67686 2.19684 5.67529 2.17923V1.48837H10.4155C11.8897 1.48837 13.2633 2.09365 14.0625 3.09416V18.8793C12.9504 18.1763 11.5583 17.7729 10.0871 17.7729H5.67529Z"
            fill="url(#paint0_linear_801_763)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_801_763"
              x1="15"
              y1="0"
              x2="15"
              y2="22.3256"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "ArrowIcon":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 12H22M22 12L13 3M22 12L13 21" stroke="url(#paint0_linear_805_712)" strokeWidth="2" />
          <defs>
            <linearGradient id="paint0_linear_805_712" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "SingleAvatar":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
          <path
            d="M8 0.75C7.00544 0.75 6.05161 1.14509 5.34835 1.84835C4.64509 2.55161 4.25 3.50544 4.25 4.5C4.25 5.49456 4.64509 6.44839 5.34835 7.15165C6.05161 7.85491 7.00544 8.25 8 8.25C8.99456 8.25 9.94839 7.85491 10.6517 7.15165C11.3549 6.44839 11.75 5.49456 11.75 4.5C11.75 3.50544 11.3549 2.55161 10.6517 1.84835C9.94839 1.14509 8.99456 0.75 8 0.75ZM4 10.25C3.00544 10.25 2.05161 10.6451 1.34835 11.3483C0.645088 12.0516 0.25 13.0054 0.25 14V15.188C0.25 15.942 0.796 16.584 1.54 16.705C5.818 17.404 10.182 17.404 14.46 16.705C14.8201 16.6464 15.1476 16.4616 15.3839 16.1837C15.6202 15.9057 15.75 15.5528 15.75 15.188V14C15.75 13.0054 15.3549 12.0516 14.6517 11.3483C13.9484 10.6451 12.9946 10.25 12 10.25H11.66C11.475 10.25 11.291 10.28 11.116 10.336L10.25 10.619C8.78796 11.0962 7.21204 11.0962 5.75 10.619L4.884 10.336C4.70865 10.2789 4.5254 10.2499 4.341 10.25H4Z"
            fill="url(#paint0_linear_754_548)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_754_548"
              x1="8"
              y1="0.75"
              x2="8"
              y2="17.2292"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "TwoAvatars":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 13C7.20435 13 6.44129 12.6839 5.87868 12.1213C5.31607 11.5587 5 10.7956 5 10C5 9.20435 5.31607 8.44129 5.87868 7.87868C6.44129 7.31607 7.20435 7 8 7C8.79565 7 9.55871 7.31607 10.1213 7.87868C10.6839 8.44129 11 9.20435 11 10C11 10.7956 10.6839 11.5587 10.1213 12.1213C9.55871 12.6839 8.79565 13 8 13ZM16 13C15.2044 13 14.4413 12.6839 13.8787 12.1213C13.3161 11.5587 13 10.7956 13 10C13 9.20435 13.3161 8.44129 13.8787 7.87868C14.4413 7.31607 15.2044 7 16 7C16.7956 7 17.5587 7.31607 18.1213 7.87868C18.6839 8.44129 19 9.20435 19 10C19 10.7956 18.6839 11.5587 18.1213 12.1213C17.5587 12.6839 16.7956 13 16 13ZM8 15C9.13517 14.9987 10.2576 15.2395 11.2922 15.7065C12.3269 16.1735 13.25 16.8558 14 17.708V19H2V17.708C2.74995 16.8558 3.67309 16.1735 4.70776 15.7065C5.74243 15.2395 6.86483 14.9987 8 15ZM16 19V16.952L15.5 16.385C15.1183 15.9522 14.7001 15.5531 14.25 15.192C14.8245 15.064 15.4114 14.9997 16 15C17.1352 14.9987 18.2576 15.2395 19.2922 15.7065C20.3269 16.1735 21.25 16.8558 22 17.708V19H16Z"
            fill="url(#paint0_linear_754_316)"
          />
          <defs>
            <linearGradient id="paint0_linear_754_316" x1="12" y1="7" x2="12" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "ThreeAvatars":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
          <path
            d="M6.05844 2.89646C6.05844 4.4964 5.09757 5.79326 3.91242 5.79326C2.72727 5.79326 1.7666 4.4964 1.7666 2.89646C1.7666 1.29664 2.72727 0 3.91242 0C5.09757 0 6.05844 1.29675 6.05844 2.89646Z"
            fill="url(#paint0_linear_882_5130)"
          />
          <path
            d="M6.35834 8.00471C6.51323 7.89671 6.68483 7.82643 6.86242 7.79283C6.50184 7.21137 6.24634 6.58762 6.09875 5.84114C6.05835 5.56835 5.73157 5.53635 5.48858 5.76263C5.03409 6.18615 4.50372 6.46957 3.91224 6.46957C3.30926 6.46957 2.75458 6.19541 2.3098 5.73657C2.16791 5.58995 1.95881 5.56789 1.79562 5.68183C0.951252 6.27118 0.312179 7.2068 0.0333903 8.31761C-0.0414067 8.61554 0.0110923 8.93713 0.174486 9.18501C0.338179 9.43254 0.59367 9.57848 0.865059 9.57848H4.73181C5.19449 8.96833 5.74077 8.43566 6.35834 8.00471Z"
            fill="url(#paint1_linear_882_5130)"
          />
          <path
            d="M13.9414 2.89646C13.9414 4.4964 14.9024 5.79326 16.0875 5.79326C17.2727 5.79326 18.2334 4.4964 18.2334 2.89646C18.2334 1.29664 17.2727 0 16.0875 0C14.9024 0 13.9414 1.29675 13.9414 2.89646Z"
            fill="url(#paint2_linear_882_5130)"
          />
          <path
            d="M13.6417 8.00471C13.4868 7.89671 13.3153 7.82643 13.1377 7.79283C13.4982 7.21137 13.7537 6.58762 13.9014 5.84114C13.9418 5.56835 14.2687 5.53635 14.5116 5.76263C14.9661 6.18615 15.4965 6.46957 16.088 6.46957C16.6909 6.46957 17.2455 6.19541 17.6903 5.73657C17.8323 5.58995 18.0413 5.56789 18.2046 5.68183C19.0489 6.27118 19.6879 7.2068 19.9668 8.31761C20.0416 8.61565 19.989 8.93713 19.8256 9.18501C19.6621 9.43254 19.4064 9.57848 19.1351 9.57848H15.2684C14.8055 8.96833 14.2593 8.43566 13.6417 8.00471Z"
            fill="url(#paint3_linear_882_5130)"
          />
          <path
            d="M15.8456 12.7827C15.4258 11.1081 14.4736 9.69211 13.213 8.78392C12.9643 8.60484 12.6415 8.63387 12.4209 8.85603C11.7444 9.53692 10.9074 9.94239 9.9984 9.94239C9.07164 9.94239 8.21938 9.52115 7.5359 8.81604C7.31781 8.5909 6.99662 8.55696 6.74583 8.73215C5.44819 9.63783 4.46592 11.0755 4.03774 12.7828C3.92264 13.2409 4.00334 13.7347 4.25433 14.1157C4.50592 14.4961 4.8986 14.7203 5.31579 14.7203H14.5675C14.9848 14.7203 15.3778 14.4969 15.6293 14.1157C15.8804 13.7346 15.9607 13.2412 15.8456 12.7827Z"
            fill="url(#paint4_linear_882_5130)"
          />
          <path
            d="M13.2968 4.45137C13.2968 6.90979 11.8202 8.90319 9.99894 8.90319C8.17771 8.90319 6.70117 6.9099 6.70117 4.45137C6.70117 1.99261 8.17761 0 9.99894 0C11.8203 0 13.2968 1.99261 13.2968 4.45137Z"
            fill="url(#paint5_linear_882_5130)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_882_5130"
              x1="3.91252"
              y1="0"
              x2="3.91252"
              y2="5.79326"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_882_5130"
              x1="3.43121"
              y1="5.60938"
              x2="3.43121"
              y2="9.57848"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint2_linear_882_5130"
              x1="16.0874"
              y1="0"
              x2="16.0874"
              y2="5.79326"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint3_linear_882_5130"
              x1="16.5689"
              y1="5.60938"
              x2="16.5689"
              y2="9.57848"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint4_linear_882_5130"
              x1="9.9417"
              y1="8.62073"
              x2="9.9417"
              y2="14.7203"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint5_linear_882_5130"
              x1="9.99899"
              y1="0"
              x2="9.99899"
              y2="8.90319"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Correct":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
          <path
            d="M1.93436 20.843C2.52836 20.0523 3.6196 19.8221 4.46944 20.3278C8.17138 22.5307 10.3403 24.3214 12.6926 27.1277C13.4296 28.0069 13.3241 29.3042 12.4934 30.0955V30.0955C11.2803 31.251 9.29086 30.6949 8.49802 29.219C7.30472 26.9976 5.59589 25.454 2.65404 23.8713C1.55072 23.2778 1.18183 21.8446 1.93436 20.843V20.843Z"
            fill="url(#paint0_linear_857_2784)"
          />
          <path
            d="M10.9451 30.4379C9.63441 30.1428 8.87896 28.7622 9.35275 27.5051C13.7581 15.8153 17.5231 9.68313 25.2466 2.03369C25.8674 1.41883 26.8792 1.46131 27.4537 2.11961V2.11961C28.0148 2.76253 27.936 3.74044 27.3047 4.3146C20.0485 10.9142 18.2651 17.2242 13.497 29.0979C13.091 30.109 12.008 30.6772 10.9451 30.4379V30.4379Z"
            fill="url(#paint1_linear_857_2784)"
          />
          <path
            d="M1.93436 20.843C2.52836 20.0523 3.6196 19.8221 4.46944 20.3278C8.17138 22.5307 10.3403 24.3214 12.6926 27.1277C13.4296 28.0069 13.3241 29.3042 12.4934 30.0955V30.0955C11.2803 31.251 9.29086 30.6949 8.49802 29.219C7.30472 26.9976 5.59589 25.454 2.65404 23.8713C1.55072 23.2778 1.18183 21.8446 1.93436 20.843V20.843Z"
            fill="url(#paint2_linear_857_2784)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_857_2784"
              x1="9.21008"
              y1="23.3713"
              x2="4.9199"
              y2="27.4578"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_857_2784"
              x1="15.4568"
              y1="14.0405"
              x2="21.4752"
              y2="18.1607"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint2_linear_857_2784"
              x1="9.21008"
              y1="23.3713"
              x2="4.9199"
              y2="27.4578"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Delete":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="30" viewBox="0 0 33 30" fill="none">
          <path
            d="M2.49469 7.33248C1.46902 6.6169 1.24857 5.36749 1.99786 4.45111V4.45111C2.76815 3.50904 4.29422 3.24333 5.45162 3.86054C16.1625 9.57234 22.1034 14.1623 29.3453 23.8896C29.9334 24.6795 29.8885 25.6874 29.2438 26.4388V26.4388C28.1568 27.7059 25.9053 27.716 24.7562 26.4752C17.4613 18.5977 11.8822 13.8819 2.49469 7.33248Z"
            fill="url(#paint0_linear_857_2781)"
          />
          <path
            d="M28.4398 7.62412C29.5178 6.82174 29.8392 5.12591 29.1267 3.94786V3.94786C28.5604 3.01136 27.5025 2.69379 26.588 3.1976C17.1355 8.40496 10.9023 13.4844 3.69552 23.2924C2.76466 24.5592 2.87681 26.4362 3.91765 27.4661V27.4661C4.89793 28.4361 6.37196 28.3224 7.32848 27.2188C14.626 18.7992 19.8555 14.0137 28.4398 7.62412Z"
            fill="url(#paint1_linear_857_2781)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_857_2781"
              x1="2.8035"
              y1="3.22781"
              x2="24.934"
              y2="30.6999"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_857_2781"
              x1="28.5966"
              y1="3.02848"
              x2="-0.467422"
              y2="21.7078"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Collaborate":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="31" viewBox="0 0 38 31" fill="none">
          <g clipPath="url(#clip0_857_2805)">
            <path
              d="M6.85283 19.9825C6.85283 19.9825 2.71718 16.6998 1.90315 15.3257C-0.643283 11.0432 2.45332 4.16708 7.95617 3.02246"
              stroke="url(#paint0_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5713 19.4395L28.0448 23.3983"
              stroke="url(#paint1_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.7637 22.1465L25.3009 25.8104"
              stroke="url(#paint2_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M31.8576 20.9796L28.9007 18.5224L24.1006 16.0781"
              stroke="url(#paint3_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.8632 26.9405C24.8343 30.0225 26.1191 26.7739 25.3057 25.8162C26.8908 26.7324 28.9056 25.5247 28.0487 23.4012C30.2774 24.4426 32.12 22.8182 31.8631 20.9862C33.7915 21.3195 34.9911 19.7785 34.4345 17.9459C38.3313 15.3607 37.3572 7.21584 34.3772 3.64665C28.9927 2.82399 27.9995 2.31483 22.2132 1.42338L14.3686 1.07464C13.2062 0.776364 12.0025 1.39621 11.5978 2.50288C11.1619 4.09069 10.6255 5.30579 9.51116 7.22683C9.08873 8.23387 9.57193 9.38582 10.5965 9.81378C11.7028 10.0826 12.2083 9.59614 13.1824 8.86313C14.455 7.67791 14.7061 7.17383 15.3885 6.28351L23.2968 9.78164L30.6718 13.8211C32.1294 14.7785 33.5777 17.1162 34.4462 17.949"
              stroke="url(#paint4_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.3967 25.7339C17.0397 24.901 17.9424 24.768 18.7994 25.2262C19.614 25.6844 20.2135 26.5579 19.6563 27.5171L18.6277 29.2657C17.9848 30.0985 16.7852 30.223 15.9711 29.6405C15.2557 29.1191 15.0481 28.2206 15.3473 27.4774C16.3967 25.7329 15.3473 27.4784 16.3967 25.7339Z"
              stroke="url(#paint5_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.1106 23.9457C13.7536 23.1129 14.6563 22.9798 15.5132 23.4381C16.3278 23.8962 16.9273 24.7699 16.3702 25.729L15.3416 27.4775C14.6986 28.3103 13.499 28.4349 12.685 27.8523C11.9695 27.331 11.762 26.4325 12.0612 25.6894C13.1106 23.9448 12.0612 25.6903 13.1106 23.9457Z"
              stroke="url(#paint6_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.26855 22.7627C9.9587 21.9356 10.9276 21.8035 11.8474 22.2586C12.7218 22.7136 13.3653 23.5813 12.7672 24.5338L11.6632 26.2703C10.9731 27.0974 9.6855 27.2212 8.81177 26.6426C8.04383 26.1248 7.82104 25.2325 8.14216 24.4944C9.26855 22.7618 8.14216 24.4953 9.26855 22.7627Z"
              stroke="url(#paint7_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.55198 20.3764C7.19497 19.5436 8.0977 19.4105 8.95463 19.8688C9.76924 20.3269 10.3687 21.2006 9.81156 22.1597L8.78301 23.9082C8.14003 24.741 6.94044 24.8656 6.12641 24.283C5.41095 23.7617 5.20339 22.8632 5.50256 22.12C6.55198 20.3755 5.50256 22.1209 6.55198 20.3764Z"
              stroke="url(#paint8_linear_857_2805)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_857_2805"
              x1="4.47809"
              y1="3.02246"
              x2="4.47809"
              y2="19.9825"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_857_2805"
              x1="24.308"
              y1="19.4395"
              x2="24.308"
              y2="23.3983"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint2_linear_857_2805"
              x1="21.5323"
              y1="22.1465"
              x2="21.5323"
              y2="25.8104"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint3_linear_857_2805"
              x1="27.9791"
              y1="16.0781"
              x2="27.9791"
              y2="20.9796"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint4_linear_857_2805"
              x1="23.1787"
              y1="1"
              x2="23.1787"
              y2="28.2385"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint5_linear_857_2805"
              x1="17.544"
              y1="24.9658"
              x2="17.544"
              y2="30.0003"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint6_linear_857_2805"
              x1="14.2579"
              y1="23.1777"
              x2="14.2579"
              y2="28.2122"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint7_linear_857_2805"
              x1="10.5"
              y1="22"
              x2="10.5"
              y2="27"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <linearGradient
              id="paint8_linear_857_2805"
              x1="7.69927"
              y1="19.6084"
              x2="7.69927"
              y2="24.6429"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
            <clipPath id="clip0_857_2805">
              <rect width="38" height="31" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
    case "Edit":
      return (
        <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>

          <mask id="path-1-inside-1_875_7012" fill="white">
            <path d="M16.4021 5.42736C18.2028 2.51929 22.0576 1.86321 24.7066 4.01394C27.1998 6.03814 27.6269 9.75544 25.6573 12.2886L16.0053 24.7023C15.4482 25.4187 14.7392 25.9939 13.9318 26.3841L5.5279 30.4464C5.39999 30.5082 5.25276 30.4085 5.25654 30.2626C5.25686 30.25 5.25838 30.2375 5.26106 30.2252L6.86944 22.8454C7.31952 20.7803 8.11358 18.8136 9.21652 17.0323L16.4021 5.42736Z" />
          </mask>
          <path
            d="M16.0053 24.7023L12.9219 22.1507L16.0053 24.7023ZM13.9318 26.3841L15.6285 30.0605L13.9318 26.3841ZM5.25654 30.2626L9.19577 30.402L5.25654 30.2626ZM5.26106 30.2252L1.41578 29.3074L5.26106 30.2252ZM5.25654 30.2626L9.19577 30.402L5.25654 30.2626ZM5.5279 30.4464L7.22456 34.1227L5.5279 30.4464ZM24.7066 4.01394L27.1315 0.834106L24.7066 4.01394ZM22.5739 9.73697L12.9219 22.1507L19.0886 27.254L28.7406 14.8402L22.5739 9.73697ZM12.2352 22.7077L3.83124 26.77L7.22456 34.1227L15.6285 30.0605L12.2352 22.7077ZM9.10634 31.143L10.7147 23.7632L3.02416 21.9276L1.41578 29.3074L9.10634 31.143ZM12.5438 19.2331L19.7294 7.62819L13.0749 3.22654L5.88927 14.8315L12.5438 19.2331ZM10.7147 23.7632C11.0655 22.1539 11.6843 20.6213 12.5438 19.2331L5.88927 14.8315C4.5429 17.0059 3.57358 19.4067 3.02416 21.9276L10.7147 23.7632ZM12.9219 22.1507C12.7374 22.388 12.5026 22.5785 12.2352 22.7077L15.6285 30.0605C16.9758 29.4093 18.159 28.4495 19.0886 27.254L12.9219 22.1507ZM9.19577 30.402C9.1893 30.6516 9.15936 30.8997 9.10634 31.143L1.41578 29.3074C1.3574 29.5752 1.32442 29.8485 1.31731 30.1233L9.19577 30.402ZM1.31731 30.1233C1.23507 33.2988 4.44005 35.4687 7.22456 34.1227L3.83124 26.77C6.35992 25.5477 9.27045 27.5182 9.19577 30.402L1.31731 30.1233ZM22.2817 7.19378C23.048 7.81591 23.1793 8.95841 22.5739 9.73697L28.7406 14.8402C32.0744 10.5525 31.3516 4.26037 27.1315 0.834106L22.2817 7.19378Z"
            fill="url(#gradient1)"
            mask="url(#path-1-inside-1_875_7012)"
          />
          <path
            d="M24.6918 11.3623C25.0527 10.8802 25.3181 10.3296 25.4727 9.74171C25.6274 9.15385 25.6683 8.54031 25.5932 7.93612C25.5181 7.33194 25.3284 6.74893 25.035 6.22039C24.7416 5.69185 24.3501 5.22814 23.883 4.85572C23.4159 4.4833 22.8823 4.20946 22.3127 4.04986C21.7431 3.89025 21.1485 3.84799 20.5631 3.9255C19.9776 4.003 19.4127 4.19875 18.9005 4.50157C18.3883 4.80439 17.939 5.20835 17.5781 5.69038L21.135 8.52632L24.6918 11.3623Z"
            fill="url(#gradient1)"
          />
          <path d="M7.95232 27.1281L8.86942 23.3571L11.2253 25.2026L7.95232 27.1281Z" fill="url(#gradient1)" />
        </svg>
      );
    case "Add":
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.4511 2.46858C11.2273 1.18663 12.2052 0 13.5066 0C14.3987 0 15.1939 0.573253 15.4683 1.42213C18.8144 11.7748 19.2673 17.7512 15.9491 28.135C15.683 28.968 14.9445 29.5617 14.0754 29.6583C12.5567 29.827 11.3167 28.4647 11.5857 26.9605C13.202 17.926 13.0755 11.7732 11.4511 2.46858Z"
            fill={color1}
          />
          <path
            d="M27.5314 11.4511C28.8134 11.2273 30 12.2052 30 13.5066C30 14.3987 29.4267 15.1939 28.5779 15.4683C18.2252 18.8144 12.2488 19.2673 1.86498 15.9491C1.03201 15.683 0.438276 14.9445 0.341707 14.0754C0.17296 12.5567 1.53534 11.3167 3.03951 11.5857C12.074 13.202 18.2268 13.0755 27.5314 11.4511Z"
            fill={color2}
          />
        </svg>
      );

    case "Clock":
      return (
        <svg viewBox="0 0 1024 1024" fill={color2} height="40" width="40">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
          <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z" />
        </svg>
      );

    case "Move":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          fill={color2}
          version="1.1"
          viewBox="0 0 232.439 232.439"
          xmlSpace="preserve"
        >
          <g>
            <path d="M55.416 64.245a7.499 7.499 0 00-8.174 1.625L2.197 110.915a7.502 7.502 0 000 10.608l45.045 45.045a7.501 7.501 0 0012.804-5.304v-90.09a7.499 7.499 0 00-4.63-6.929zm-10.37 78.912l-26.938-26.938L45.046 89.28v53.877zM121.523 2.196a7.502 7.502 0 00-10.607 0L65.871 47.241a7.5 7.5 0 005.304 12.804h90.09a7.499 7.499 0 005.304-12.804L121.523 2.196zM89.281 45.045l26.938-26.938 26.939 26.938H89.281zM230.242 110.915L185.197 65.87a7.499 7.499 0 00-12.804 5.304v90.09a7.499 7.499 0 0012.804 5.304l45.045-45.045a7.502 7.502 0 000-10.608zm-42.849 32.242V89.28l26.939 26.938-26.939 26.939zM161.263 172.393H71.175a7.499 7.499 0 00-5.304 12.804l45.045 45.046a7.502 7.502 0 0010.608-.001l45.043-45.046a7.499 7.499 0 00-5.304-12.803zm-45.043 41.94l-26.938-26.939h53.876l-26.938 26.939z" />
          </g>
        </svg>
      );

    default:
      return <div />;
  }
};

export default Icon;
