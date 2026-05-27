import { useEffect, useState } from "react";
import axios from "axios";

import { formatAIModels } from "@/lib/utils/aiModel";

export default function useAIModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://ai-gateway.vercel.sh/v1/models"
        );

        const formatted = formatAIModels(
          res.data.data || []
        );

        setModels(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return {
    models,
    loading,
  };
}