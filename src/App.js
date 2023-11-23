import './App.css';
import * as React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import Item from "./components/Item";
import FooterComponent from "./components/FooterComponent";
import {HelmetProvider} from "react-helmet-async";
import HomeComponent from "./components/HomeComponent";
import PageComponent from "./components/PageComponent";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./components/CustomTheme";

const helmetContext = {};


function App() {
    return (
        <Router>
            <HelmetProvider context={helmetContext}>
                <ThemeProvider theme={theme}>
                    <div className="App">
                        <HeaderComponent/>
                        <Routes>
                            <Route path="/" exact element={<HomeComponent/>}/>
                            <Route path="/:slug" exact element={<PageComponent/>}/>
                            <Route path="/item/:id" exact element={<Item/>}/>
                        </Routes>
                        <FooterComponent/>
                    </div>
                </ThemeProvider>
            </HelmetProvider>
        </Router>
    );
}

export default App;
