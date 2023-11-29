import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { question } = await req.json();

    const res = await fetch(
      "https://fju-test3.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=shelly-search-test&api-version=2021-10-01",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "fde6fc08d2e14a71b844af69aeea65f7",
        },
        body: JSON.stringify({
          question,
        }),
      }
    );
    const result = await res.json();

    return NextResponse.json({ message: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "ERROR", err }, { status: 500 });
  }
};
