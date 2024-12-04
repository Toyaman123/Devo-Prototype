'use client';
import GameScreen from './components/GameScreen';

export default function Home() {
  return (
    <>
      <main className="app">
        {/* <!-- top contents --> */}
        <div className="header">
          <div className="header-logo">Devo</div>
          <div className="header-score">
            score{' '}
            <span id="score" className="header-score-val">
              0
            </span>
          </div>
        </div>
        {/* <!-- middle contents --> */}
        <div className="main">
          <GameScreen />
          <div>
            <div className="main-devo-kinds">
              <img src="./kinds.jpg" />
            </div>
            <div className="main-guide">
              <h2>Guide</h2>
              <p>←：左に移動</p>
              <p>→：右に移動</p>
              <p>shift：落下</p>
            </div>
          </div>
        </div>
        {/* <!-- bottom contents --> */}
        <div className="ranking">
          <h2>Ranking</h2>
          <div className="ranking-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Update Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>田中 太郎</td>
                  <td>1500</td>
                  <td>2024-09-29</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>鈴木 花子</td>
                  <td>1400</td>
                  <td>2024-09-28</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>佐藤 次郎</td>
                  <td>1350</td>
                  <td>2024-09-27</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>高橋 真美</td>
                  <td>1300</td>
                  <td>2024-09-26</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>伊藤 太一</td>
                  <td>1250</td>
                  <td>2024-09-25</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>渡辺 美咲</td>
                  <td>1200</td>
                  <td>2024-09-24</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>中村 健一</td>
                  <td>1150</td>
                  <td>2024-09-23</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>小林 由美</td>
                  <td>1100</td>
                  <td>2024-09-22</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>松本 亮</td>
                  <td>1050</td>
                  <td>2024-09-21</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>山本 優子</td>
                  <td>1000</td>
                  <td>2024-09-20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
