import "../css/detail.css"
import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {DateRangePicker} from "react-date-range";
import format from "date-fns/format"
import {addDays, differenceInDays} from "date-fns"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Footer from "./Footer"; // theme css file

function Detail() {

    const navigate = useNavigate();
    const [house, setHouse] = useState({});
    const idAccount = sessionStorage.getItem('account_id');
    const price = house.price;

    const a = Number(house.price);
    const formattedNumber = a.toLocaleString();
    // console.log(house.price)
    const params = useParams();

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
    }

    async function getHouse() {
        const res = await axios.get(`http://localhost:8080/api/house/${params.id}`)

        setHouse(res.data);
    }

    useEffect(() => {
        getHouse()
    }, []);
    const handleViewDirections = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(house.address)}`;
        window.open(googleMapsUrl, '_blank');
    };


    const [range, setRange] = useState([{
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: 'selection'
    }]);

    const [open, setOpen] = useState(false)

    const refOne = useRef(null);

    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)

    }, []);

    const hideOnEscape = (e) => {
        console.log(e.key)
        if (e.key === "Escape") {
            setOpen(false)
        }
    }

    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false)
        }
    }


    async function BookHouse(e) {
        e.preventDefault();

        const dateStart = new Date(range[0].startDate);
        const dateEnd = new Date(range[0].endDate);
        const oneDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày
        const diffDays = Math.round(Math.abs((dateStart - dateEnd) / oneDay)) + 1;
        const yearStart = dateStart.getFullYear();
        const monthStart = dateStart.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        const dayStart = dateStart.getDate();

        const yearEnd = dateEnd.getFullYear();
        const monthEnd = dateEnd.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        const dayEnd = dateEnd.getDate();

        const date = `${yearStart}-${monthStart}-${dayStart} -- ${yearEnd}-${monthEnd}-${dayEnd}`;
        const response = await axios.post('http://localhost:8080/api/order', {
            date: date,
            idHouse: params.id,
            total: diffDays,
            revenue: price * diffDays,
            idAccount: idAccount,
        })

       navigate('/home')
    }


    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary"
                     style={{boxShadow: " 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                    <div className="container-fluid">
                        <div className="navbar w-100">
                            <a className="navbar-brand" href="/home">Agoda</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"/>
                            </button>
                            <ul class="nav nav-underline">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="/home">Trang chủ</a>
                                </li>

                            </ul>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                                <div className="navbar-nav ">


                                    <div class="dropdown">
                                        <div class="btn-group dropstart">
                                            <button type="button" class="btn btn-secondary dropdown-toggle"
                                                    data-bs-toggle="dropdown" aria-expanded="false">
                                                Tên chủ nhà
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="/host">Chủ nhà</a></li>
                                                <li><a class="dropdown-item" href="/create">Đăng nhà</a></li>
                                                <li><a class="dropdown-item" href="/history">Lịch sử đặt</a></li>
                                                <li><a class="dropdown-item" href="#">Chi tiết tài khoản</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div class="blog-single">
                <div class="container">
                    <div class="row ">
                        <div class="col-lg-8 m-15px-tb">
                            <article class="article">
                                <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        {house.images?.map((item, index) => (
                                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <div>
                                                    <img src={process.env.PUBLIC_URL + '/img/' + (item.nameImage)}
                                                         class="d-block w-100" alt={`Carousel Image ${index + 1}`}/>
                                                </div>

                                            </div>
                                        ))}
                                    </div>

                                    <button class="carousel-control-prev" type="button"
                                            data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button"
                                            data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>
                                <div className="test">
                                    <div className="test1">
                                        <div className="article-title">
                                            <h2>{house.address}</h2>
                                        </div>

                                        <h2>Giá: {formattedNumber}(VND)</h2>
                                        <div className="article-content">
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <h5 style={{marginRight: '8px'}}>Địa chỉ: {house.name}</h5>
                                                <a style={{marginBottom: '13px', marginLeft: '13px'}}
                                                   onClick={handleViewDirections}>Xem chỉ dẫn</a>
                                            </div>
                                            <h5>Số phòng ngủ: {house.numberOfBedRoom}</h5>
                                            <h5>Số phòng tắm: {house.numberOfBathRoom}</h5>
                                        </div>
                                        <form onSubmit={BookHouse}>
                                            <div className="calendarWrap">
                                                <input
                                                    value={`${format(range[0].startDate, "yyyy-MM-dd")} -- ${format(range[0].endDate, "yyyy-MM-dd")}`}
                                                    className="inputBox"
                                                    onClick={() => setOpen(open => !open)}
                                                />
                                                <div ref={refOne}>
                                                    {open &&
                                                        <DateRangePicker
                                                            onChange={item => setRange([item.selection])}
                                                            editableDateInputs={true}
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={range}
                                                            months={2}
                                                            direction="horizontal"
                                                            className="calendarElement"
                                                        />
                                                    }
                                                </div>
                                                {range[0].startDate && range[0].endDate && (
                                                    <p>
                                                        Số ngày: {differenceInDays(range[0].endDate, range[0].startDate) + 1}
                                                    </p>
                                                )}
                                                <p>Tổng tiền: {(differenceInDays(range[0].endDate, range[0].startDate) + 1)*price}</p>
                                            </div>
                                            <input type="submit" value="Đặt nhà"/>
                                        </form>
                                    </div>

                                </div>
                            </article>
                            <div class="contact-form article-comment">
                                <h4>Mô tả</h4>
                                <form id="contact-form" method="POST">
                                    <div class="row">

                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <textarea name="message" id="message"
                                                          placeholder="Để lại nhật xét của bạn" rows="4"
                                                          class="form-control"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{marginTop: "1%"}}>
                                            <button type="button" class="btn btn-outline-success">Đăng</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="col-lg-4 m-15px-tb blog-aside">

                            <div class="widget widget-author">
                                <div class="widget-title">
                                    <h3>Author</h3>
                                </div>
                                <div class="widget-body">
                                    <div class="media align-items-center">
                                        <div class="avatar">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar6.png" title=""
                                                 alt=""/>
                                        </div>
                                        <div class="media-body">
                                            <h5>Tên người cho thuê </h5>
                                        </div>
                                    </div>
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-primary" type="button">Số liên hệ:</button>
                                        <button class="btn btn-outline-dark" type="button">Chat với chủ nhà</button>
                                        <button class="btn btn-outline-dark" type="button">Yêu cầu liên lạc lại</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    )
}

export default Detail;