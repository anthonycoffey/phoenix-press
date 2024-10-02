import React from "react";
import { Avatar, Stack } from "@mui/material";
import SpeechBubble from "./SpeechBubble";

const Prompt = ({ question }) => {
  const assets = LOCALIZED?.ASSETS_URL ?? "";
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Avatar src={`${assets}/avatar.jpg`} alt="Technician Avatar" />
      <SpeechBubble>
        <label>{question.prompt}</label>
      </SpeechBubble>
    </Stack>
  );
};

export default Prompt;
