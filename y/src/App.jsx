import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [memos, setMemos] = useState(() => {
    const savedMemos = localStorage.getItem("memo-list");
    if (savedMemos) {
      return JSON.parse(savedMemos);
    }

    return [
      {
        id: 1,
        title: "React 수업 메모",
        content: "메모장 CRUD 프로젝트의 등록, 검색, 수정, 삭제 기능을 정리한다.",
        createdAt: "2026.06.11",
      },
      {
        id: 2,
        title: "Vite 프로젝트 구조 확인",
        content: "src 폴더 안에 App.jsx와 App.css를 본리해서 작성한다.",
        createdAt: "2026.06.15",
      },
    ];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedMemoId, setSelectedMemoId] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("memo-list", JSON.stringify(memos));
  }, [memos]);

  const selectedMemo = memos.find((memo) => memo.id === selectedMemoId);

  const filteredMemos = memos.filter((memo) => {
    const keyword = searchText.toLowerCase();
    const memoTitle = memo.title.toLowerCase();
    const memoContent = memo.content.toLowerCase();
    return memoTitle.includes(keyword) || memoContent.includes(keyword);
  });

  const getToday = () => {
    const now = new Date();
    return now.toLocaleDateString("ko-KR");
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle === "" || trimmedContent === "") {
      alert("메모 제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (editId) {
      const updatedMemos = memos.map((memo) =>
        memo.id === editId
          ? {
              ...memo,
              title: trimmedTitle,
              content: trimmedContent,
              createdAt: getToday(),
            }
          : memo
      );

      setMemos(updatedMemos);
      setSelectedMemoId(editId);
      resetForm();
      return;
    }

    const newMemo = {
      id: Date.now(),
      title: trimmedTitle,
      content: trimmedContent,
      createdAt: getToday(),
    };

    setMemos([newMemo, ...memos]);
    setSelectedMemoId(newMemo.id);
    resetForm();
  };

  const handleEditMemo = (memo) => {
    setEditId(memo.id);
    setTitle(memo.title);
    setContent(memo.content);
    setSelectedMemoId(memo.id);
  };

  const handleDeleteMemo = (id) => {
    const isConfirm = window.confirm("이 메모를 삭제할까요?");
    if (!isConfirm) {
      return;
    }

    const updatedMemos = memos.filter((memo) => memo.id !== id);
    setMemos(updatedMemos);

    if (selectedMemoId === id) {
      setSelectedMemoId(null);
    }

    if (editId === id) {
      resetForm();
    }
  };

  const handleClearAll = () => {
    if (memos.length === 0) {
      alert("삭제할 메모가 없습니다.");
      return;
    }

    const isConfirm = window.confirm("모든 메모를 삭제할까요?");
    if (!isConfirm) {
      return;
    }

    setMemos([]);
    setSelectedMemoId(null);
    resetForm();
  };

  return (
    <div className="app">
      <main className="memo-container">
        <header className="memo-header">
          <div>
            <span className="header-badge">CRUD Project</span>
            <h1>메모장 앱 만들기</h1>
            <p>메모 제목과 내용을 등록하고 검색, 수정, 삭제할 수 있습니다.</p>
          </div>

          <div className="memo-count-card">
            <strong>{memos.length}</strong>
            <span>전체 메모</span>
          </div>
        </header>

        <section className="memo-layout">
          <aside className="memo-form-panel">
            <h2>{editId ? "메모 수정" : "새 메모 등록"}</h2>
            <form onSubmit={handleSubmit} className="memo-form">
              <label>
                <span>메모 제목</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 오늘 수업 정리"
                />
              </label>

              <label>
                <span>메모 내용</span>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="메모 내용을 입력하세요."
                />
              </label>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  {editId ? "수정 완료" : "메모 등록"}
                </button>
                <button type="button" className="reset-btn" onClick={resetForm}>
                  초기화
                </button>
              </div>
            </form>
          </aside>

          <section className="memo-list-panel">
            <div className="search-area">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="제목 또는 내용으로 검색하세요"
              />
              <button onClick={handleClearAll}>전체 삭제</button>
            </div>

            <p className="result-text">
              검색 결과 <strong>{filteredMemos.length}</strong>개
            </p>

            <div className="memo-list">
              {filteredMemos.length === 0 ? (
                <div className="empty-box">등록된 메모가 없거나 검색 결과가 없습니다.</div>
              ) : (
                filteredMemos.map((memo) => (
                  <article
                    key={memo.id}
                    className={`memo-card ${selectedMemoId === memo.id ? "selected" : ""}`}
                    onClick={() => setSelectedMemoId(memo.id)}
                  >
                    <div className="memo-card-top">
                      <h3>{memo.title}</h3>
                      <span>{memo.createdAt}</span>
                    </div>
                    <p>{memo.content}</p>
                    <div className="memo-actions">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMemo(memo);
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMemo(memo.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="memo-detail-panel">
            {selectedMemo ? (
              <>
                <span className="detail-badge">Selected Memo</span>
                <h2>{selectedMemo.title}</h2>
                <p className="detail-date">{selectedMemo.createdAt}</p>
                <div className="detail-content">{selectedMemo.content}</div>
                <button className="detail-edit-btn" onClick={() => handleEditMemo(selectedMemo)}>
                  이 메모 수정하기
                </button>
              </>
            ) : (
              <div className="detail-empty">
                <strong>메모를 선택하세요</strong>
                <p>왼쪽 목록에서 메모를 클릭하면 상세 내용이 표시됩니다.</p>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
