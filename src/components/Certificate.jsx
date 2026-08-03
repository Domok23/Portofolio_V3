import React, { useState } from "react";
import { Modal, IconButton, Box, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const Certificate = ({ ImgSertif }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box component="div" sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          bgcolor: "var(--color-surface)",
          transition: "border-color 0.2s ease-out",
          "&:hover": {
            borderColor: "var(--color-accent)",
            "& .overlay": { opacity: 1 },
          },
        }}
      >
        <img
          src={ImgSertif}
          alt="Certificate"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        />

        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            transition: "opacity 0.2s ease-out",
            cursor: "pointer",
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
            gap: 1,
          }}
          onClick={() => setOpen(true)}
        >
          <FullscreenIcon sx={{ fontSize: 36 }} />
          <span style={{ fontWeight: 600 }}>View Certificate</span>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="certificate-modal"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 200,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.85)" },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close certificate"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              zIndex: 1,
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <img
            src={ImgSertif}
            alt="Certificate Full View"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "90vh",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Certificate;
