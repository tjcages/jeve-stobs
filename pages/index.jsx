import Meta from "../components/Meta";
import Cursor from "../components/Cursor";

import Introduction from "../components/Introduction";
import Stage from "../components/Stage";
import Subtitles from "../components/Subtitles";

export default function Home() {
  return (
    <Meta>
      <main>
        {/* <Introduction /> */}
        <Stage />
        <Subtitles />
      </main>

      {/* <Cursor /> */}
    </Meta>
  );
}
