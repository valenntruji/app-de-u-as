import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mercadopago from "mercadopago";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.post("/create_preference", async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: req.body.title || "Turno de uñas",
          quantity: 1,
          unit_price: Number(req.body.price) || 1000
        }
      ],
      back_urls: {
        success: process.env.FRONTEND_URL,
        failure: process.env.FRONTEND_URL,
        pending: process.env.FRONTEND_URL
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Servidor backend en puerto", PORT);
});
