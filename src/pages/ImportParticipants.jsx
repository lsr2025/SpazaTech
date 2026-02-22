/**
 * Copyright © 2026 Kwahlelwa Group (Pty) Ltd.
 * All Rights Reserved.
 */
import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Loader2, CheckCircle, Users, AlertCircle, FileSpreadsheet, Plus } from 'lucide-react';
import { toast } from 'sonner';

// ─── Full ILEMBE RAW dataset (ILEMBERAW.xlsx – 483 participants) ──────────────
const RAW_PARTICIPANTS = [
["9809120941088","Philisiwe Mpendulo","Zwane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["8702201110080","Lerato Peaceful","Mokoena","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["8607250937087","Nompilo Zandile","Nxumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9801030656088","Nonjabulo","Khoza","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9603010822080","Nobuhle Bridget","Khuzwayo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["8008301064080","Sibongile Promise","Mgwaba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0509126469089","Nzuzo Peacemaker","Khumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["0305071159084","Lungile Thobekile","Blose","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0010020585088","Nokwazi","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9808130641084","Neliswa Tusani","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0410190847088","Thandeka Pretty","Khuzwayo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9504065454086","Sipho Gift","Gasa","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["0507175570088","Lindelwa Joy","Mkhize","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["9212170703088","Nonhlakanipho Zothile","Ngiba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["8607225696081","Vusimuzi Abednigo","Majola","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["8704170343080","Ncamsile Andile","Madlala","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9403081359082","Nobuhle SFanele","Khuzwayo","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9808121396086","Nothile Simphiwe","Ntuli","2025-11-06","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9202295354081","Themba","Sithole","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9204030485089","Nelisiwe Zinhle","Gumede","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9302160424082","Ayanda Angel","Sibiya","2025-11-11","District Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Ayanda Sibiya"],
["9307020470084","Ignatia Noxolo","Mbonambi","2025-11-11","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Noxolo Mbonambi"],
["8802251136082","Nondumiso Bridgette","Gumede","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0010055404080","Ntsikelelo","Mpanza","2025-11-03","M&E administrator","Enterprise Ilembe Holdings Pty Ltd","Project Office"],
["8709291236089","Nokuthula","Ncalane","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0008206191085","Zamani","Mthombeni","2025-11-11","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Zamani Mthombeni"],
["9507300226086","Nomonde","Ngobese","2025-11-03","District Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","DISTRICT COD NOMONDE NGOBESE"],
["9512151133084","Khanyisile","Zungu","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9705205768083","Sikhumbuzo Melizwe","Makhanya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0208296142085","Celumusa","Gwamanda","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8707165872088","Nkululeko","Shozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["8404042125084","Siyethembe","Dube","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9204151341087","Smangele","Ngwenya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0007020755083","Lungelo Celimpilo","Dlamini","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9602231086087","Thandiwe","Gcabashe","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0405230295082","Andiswa","Mzolo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0506280482080","Nonjabulo","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0306091056086","Nombuso Happiness","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0407220685082","Olwethu","Jali","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9807101033081","Lungile Cynthia","Ndimande","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8802261116082","Zuzile Nosipho LadyFare","Buthelezi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0211200797085","Sinothile","Gumede","2025-11-06","Ordinary Participant (half day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0409275662081","Siphamandla","Lushozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9109111627089","Priscilla Xolile","Ncube","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9801150615088","Sphindile","Msane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9506090843084","Mahlekhona","Ncwane","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9901015551088","Zwelihle Mcebo","Chamane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9510060430088","Siyethemba Purity","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0608135846087","Mfundo","Mkhize","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9207286052081","Nkosikhona","Luthuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9907256018083","Sphamandla","Mathonsi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9109051180081","Thandekile","Zondi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9104055960083","Sthembiso Derrick","Chamane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0301095723088","Khethukthula","Gwamanda","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0204020211080","Zanele Nokulunga","Msomi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0305250709089","Sindiswa Phumelele","Zondi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0407155883082","Siyanda","Majozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9502076267083","Ntozonke","Maphumulo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9203265242082","Ndumiso Knowledge","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0403046349086","Khanyisani","Dlamini","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9611171094084","Nondumiso Valentia","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0508111223089","Nomfundo","Mngadi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0205115919081","Sanele","Gcina","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0011075220084","Thalente Samkelo","Chamane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["8008150699085","Busisiwe Zifune","Msomi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0011010818083","Zanele","Ndimande","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0204260097082","Nondumiso","Nkomonde","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9712080734081","Minenhle","Ncalane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9901210310082","Smilo","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0302161223086","Luyanda","Mseleku","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0310081067087","Philasande","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9202256064083","Bongani Innocent","Magwaza","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9012241039086","Samukelisiwe","Shezi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0009145478088","Vusi Senzo","Malunga","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0101155716083","Fisakuphi","Mtshali","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0107250825083","Nosipho Zithobile","Mthembu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8506156260083","Siyabonga Bright","Ngcobo","2025-11-07","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9004040985080","Nelisiwe","Mhlongo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9708015800088","Bongumenzi","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9907096081085","Samkelo","Mkhize","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9709270765081","Nosipho","Magwaza","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["7502050788080","Khombisile","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9905090901084","Londeka","Mathibela","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9205240724084","Ntombifuthi","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9905270491088","Nomusa Thandeka","Zondo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9302195404083","Inamandla Hopewell","Mngadi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9812180625088","Nomfundo","Bhengu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9109061500088","Sindiswa","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9607260750081","Anele","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["7602140835089","Shongani Cynthia","Mdluli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["0205090953089","Thandiwe","Mthalane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9009146513082","Mfanafuthi Andile","Khumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9801290593088","Thobekile","Shozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8706266359086","Philani Kenneth","Phewa","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9406271202087","Zinhle","Mtshali","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0201160324087","Bonakele","Ncube","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0208235813085","Busani","Blose","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0507245588086","Amahle","Mbhele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9612281280084","Bonisiwe Veronica","Mzimela","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9108065523088","Sthembiso","Zuma","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9805060150086","Nothando Brightnes MP","Mbonambi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9209151540083","Nonhlanhla Precious","Mbata","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["0212060590081","Ntando Samukelisiwe","Dladla","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9801190619082","Nonsikelelo Nomonde","Ngubane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9211290576085","Mbali Pretty","Ndhlovu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["8701150784085","Ningi","Gcwensa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9201070192088","Thobeka","Mkhwanazi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0406180561085","Luyanda","Maphumulo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9807280570085","Angel","Mtembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9703110692084","Nkosithandile","Qwabe","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0006236334089","Kwanele Sandile","Khoza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9501230460089","Patience Nosipho","Madlala","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9302065749088","Yonela Goodboy","Tshabani","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0407185796080","Sbonelo Njabulo","Dube","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9409250964081","Lindokuhle Hlengiwe","Nxumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9112061203083","Akhona","Khuhlaza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9807020840087","Simphiwe Princess","Mkhize","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9307051244085","Sinenhlanhla Pruddy","Xulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9509201655082","Zamile Nokubonga","Mdletshe","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0504231338089","Ayanda","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9204070711089","Thandeka Patricia","Mchunu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8211050360085","Deliwe Anna","Khumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["0403020617086","Nomvula Ntombifuthi","Moletshe","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0010011080081","Nandiswa Annittor","Ntuli","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9403305965086","Mzwandile Thabiso","Guilundo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0409151678086","Noluthando","Mthembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0201201130089","Nothando Angela","Khanyile","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0505216007086","Sinothile Richard","Simamane","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0405070798088","Mbali Julie","Mbonambi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9706140727085","Nomcebo Pretty","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9103031957080","Zanele Ntokozo","Vilakazi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9409161462084","Snenhlanhla","Seme","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["6801060561086","Veronica","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9611210877085","Nonhlanhla Anele Ubenzeni","Mjadu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9408135792089","Lindokuhle Branden","Myeza","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9609185850087","Dumisani Ayanda","Mathaba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9305040448080","Nothando Nompilo","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9702056209085","Thubelihle","Mdluli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9006200941084","Londiwe Potcea","Mfeka","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9012050599089","Simphiwe Njabliso Ubuzani","Mjadu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["8911165965088","Ishmael Ayanda","Ngema","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9507216108089","Mluleki","Sishi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9706010983081","Nombuso","Ncube","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["0204061041081","Nonsikelelo Siphokazi","Mthethwa","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9210071234088","Nkosingiphile Patiance","Mzimela","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9304220360082","Nokukhanya Nokuzola","Makhanya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["9604230700080","Ncamsile Happiness","Mathaba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["0006260604084","Nothando Busiswa","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["0107270691085","Martha","Zungu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8809281294088","Nokuthula Witness","Shezi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9307101067080","Zanele","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["0311111301082","Nikiwe","Mabika","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["8309100710083","Nonhlanhla Cebisile","Chili","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9012050993084","Thandeka N","Xulu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9707260703088","Siphokazi Thembelihle","Ndlovu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["0112061240084","Sthabiso","Sibiya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["0306191061085","Brightness","Chili","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9205021127085","Zinhle","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["0504301118080","Xoliswa Snenhlanhla","Mcineka","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9608061539087","Nokwanda Precious","Dube","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9201120993089","Phumlaphi Nosihle","Zwane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["9810190809080","Buhlebuyeza","Zungu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9305020737080","Ayanda Witness","Phungula","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9803281279081","Vumile Pearl","Mbelu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["8202101097081","Phindile Phiwile","Mthembu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9512040729084","Sanelisiwe Queneth","Mathonsi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9304040993088","Lungile Lucia","Ngobese","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9804201291081","Lindiwe","Sibiya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["0703240770080","Ya Amahle","Ndlovu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9302210385085","Nomfundo Nhlakanipho","Mchunu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9109025556085","Mfanifani Bongumusa","Mdluli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["0403145619082","Nduduzo","Zwane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9109241106087","Sinenhlanhla Simphiwe","Mdletshe","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9312210882080","Preacious Nqobile","Ncwane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["0005315763085","Samkelo Mbuso","Hlabisa","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9611260462085","Sthabile Faith","Khoza","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9304150624085","Percival Simphiwe","Makhoba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9507160657081","Nolwazi","Mbatha","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9907135033089","Thabiso Lungelo","Goge","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9805136079087","Zamokwakhe Mthandeni","Xulu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["8607130392081","Ntombizethu Angeline","Jama","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["9707160876083","Sibongile","Nxumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["8807135883080","Clifford Lindani","Mnqayi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni"],
["7212220960086","Nomusa","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["0106131203080","Nontuthuko Sinethemba","Busana","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9903201321086","Noxolo","Mhlongo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["0108165705089","Sphamandla Fortune","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9603310898087","Nomfundo","Ngiba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["8904150357080","Zamantungwa Joyce","Khumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["9012186258089","Thamisanqa","Ngwane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 06"],
["0506016189082","Aphelele Handsome","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9103180663083","Sindisiwe Pretty","Manqele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9001091189083","Phiweni","Moniwa","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0107010265083","Thembeka","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9902210595086","Nokulunga Thobeka","Mazibuko","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0109055869084","Ntuthuko Menzi","Mbele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9106230842086","Cebisile","Myeza","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["8401012228088","Sizakele","Ncube","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0303160777080","Sinenhlanhla","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9801030368080","Nwabisa","Mnyani","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8709230456087","Sanelisiwe","Sibisi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9308071145088","Londiwe Zanele","Mgeyane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8503045843088","Sfiso","Sibiya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0003015870086","Vuyo","Sibiya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9812255714080","Siboniso Mbuso","Masuku","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0101241067087","Sebenzile","Vuma","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8012100612081","Sibongile Thobile Helen","Lushozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9102111316084","Nomvelo Siyanda","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9601241084082","Thobekile Nomkhosi","Mlangeni","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9008020237081","Simphiwe Promise","Tela","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["7511020670088","Happy Nontokozo","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8905230786081","Andile Londiwe","Sibiya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9104155615082","Simphiwe","Mngadi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["7906210905080","Bongiwe Princess","Mnyandu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0410090993081","Luyanda","Nzama","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8508086154089","Thobeka","Nzama","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8611201252083","Gugu Wendy","Gondwe","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9910030848080","Luyanda","Dlamini","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8607011003088","Nokukhanya","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["0210271007085","Simthandile Sbongile","Mhlongo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["8902145690086","Mfundo","Vilakazi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9707305953086","Lindani Simo","Manyoni","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0112181194088","Sthabile Thobile","Dlamini","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9403310560088","Tholakele","Sabela","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9707246038088","Siphesihle","Ximba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0107206021084","Philani","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0409080976080","Zinhle Aphile","Vilane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9302231296089","Nompilo","Ngidi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9401160580081","Nonhlanhla","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9806051102086","Sikhulile","Mbonambi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["9303061221080","Mbali","Ndlovu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0611190708085","Sinethemba","Zungu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0003280629084","Prettygirl Yoliswa","Mkhize","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["8602140701082","Slindelo Nosihle","Msomi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["8308081622085","Hlengiwe","Ngidi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["9408281196085","Xoliswa","Zungu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0207180410087","Sbongakonke","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0405160937083","Vela Valencia","Mkhize","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["8210140859080","Lungile Alex","Mkhize","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["9601041318086","Thembelihle","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0403086118086","Langalensindiso","Nsele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9310030396083","Zamalinda Happiness","Nsele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0003261129088","Thembelihle Ellena","Khumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9902141108082","Nokukhanya Nobuhle","Sikhakhane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9609176019080","Mhlengi","Mabasa","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["7410075569081","Nkosinathi","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9805166148083","Phelokwakhe","Nkosi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9803110751086","Anele Patience","Luthuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0201020641084","Nothando Nomkhosi","Bhengu","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9508180813084","Nonjabulo","Mbatha","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9906231234088","Zanele","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9111280908084","Nqobile","Shangase","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["0008106215083","Lindokuhle Siyabonga","Mbatha","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9301271083084","Sbahle Newearth","Shozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0008140910087","Snenhlanhla","Cele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0310185955088","Thobani","Goba","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9607180914080","Nokwanda","Simamane","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9208040797086","Sinenhlanhla Nontobeko","Cele","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9809111269085","Pumla","Mhlongo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["8304130607086","Khanyisile Charity","Shangase","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9711041243083","Nompumelelo Ayanda","Mtiya","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9705080227080","Sweetness","Ntuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["8112110327082","Dolly Felicity","Mhlongo","2025-11-03","District Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Dolly Mhlongo"],
["0106241095087","Gugulethu","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9311300793082","Thecla Loveness Nokwanda","Shangase","2025-11-06","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9407031070087","Slindile Melody","Chili","2025-11-03","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9303085549086","Sbonelo Vukani","Maphumulo","2025-11-01","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Mandeni Mathonsi"],
["8707255977086","Snqobile","Nxumalo","2025-11-01","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Snqobile Nxumalo"],
["0002250933088","Sihawukele","Jele","2025-11-01","Field Supervisor","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9608030436084","Samkelisiwe","Zondo","2025-11-01","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Samkelisiwe Zondo"],
["8409305336088","Sibongiseni","Ngcongo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9611250963084","Silindile","Danisa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0502221396083","Nobuhle","Mtolo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9707220984083","Dumisile","Shangase","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["8411290618082","Ntombiyenkosi Nonhlanhla","Tembe","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9608231053084","Samukelisiwe","Khuzwayo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["8402141389080","Sbusisiwe Lungile","Zondi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9807281426089","Sandisa","Mbatha","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0404241134083","Bavikile Welile","Ngidi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 01"],
["9210030416081","Nokulunga Innocentia","Khumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0010211043087","Sinendumiso","Mkhize","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0203205488083","Kwanele Bongumenzi","Gama","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9110210361083","Nonhlanhla","Msomi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9604150789089","Bongiwe","Thabede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9901075849083","Thobelani Zamokuhle Siphephelo","Goge","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9108225972084","Siphamandla","Gama","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0612141154080","Lindelwa","Ndlovu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9007126252085","Zipho Nduduzi","Ndebele","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9707220983085","Nondumiso Fortunate","Shangase","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0401100940089","Thobeka Xoliswa","Mabuza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0508031199088","Andiswa","Shezi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["8604020955085","Nomthandazo Gladness","Kumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0210130699080","Nokuhle","Xulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9002251165087","Nompumelelo","Khuzwayo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9510111042080","Minenhle","Mkhize","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0202210950087","Fezile Octavia","Ncwane","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["8709026110088","Njabulo Freedom","Ncanyana","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9110281307080","Nokulunga","Zungu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["8902170840085","Khumbuzile","Langa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0001155064080","Melusi","Ntuli","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["7705080274084","Monica","Cele","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0003210785089","Ayanda","Khuzwayo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9702260570082","Jabulisiwe","Dube","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9209091571081","Happiness","Zulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9601241330089","Slindile","Luthuli","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0303100921087","Ncamisile Andiswa","Msweli","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9509195621082","Lungisani","Mcanyana","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["8801060771089","Pearl","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0007041432084","Nompumelelo","Ntuli","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9811205654081","Qhamukani Bekithemba","Ntanzi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9705240714084","Gcino","Mtshali","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0305305083084","Mhlengi Siyabonga","Nzuza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 01"],
["9112190803084","Nqobile","Mdletshe","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9307265938084","Sboniso","Xulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 01"],
["0301060804087","Nothando","Nzuza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9304171104083","Noxolo","Dladla","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 01"],
["9807300672085","Minenhle","Ngidi","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["7610230388083","Maninginingi Thembokuhle","Gama","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 01"],
["9312281132084","Thandiwe","Mthembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9606050823082","Jabulile","Gcwabaza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0504210663085","Olwethu Mbali","Mthembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0312230297086","Thobeka","Mpungose","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0303091257087","Luyanda","Ndlovu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["0402116349083","Sfundo","Mhlango","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9004180807086","Nompumelelo Bright","Shobede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9904020920082","Snenhlanhla","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0101310311085","Buthelezi","Nonjabulo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["7909236123084","Philani Gaylord","Mthethwa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0408040868080","Lerato Amahle","Mthembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["0607061749083","Snenhlanhla","Mpunzana","2025-11-06","Ordinary Participant (half day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0112155498085","Siphesihle Nkosinathi","Cele","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0105231113082","Ayanda","Ngiba","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["8212111025089","Londekile Happiness","Langazana","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9910190751082","Ayanda Angel","Nxumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9608050466086","Thembelihle Faith","Dlamini","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9907215583086","Mfanafuthi","Ndlovu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["8809150744080","Nozipho","Nxumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9306160912087","Sizakele Isabel","Dlomo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9710280864088","Nokwanda","Hlongwa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0105280841088","Samkelisiwe","Xulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["7404305825082","Simphiwe Clement","Mthembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0310171133088","Yanele Amanda","Mtembu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["8901170553086","Nonkanyiso Brightness","Mhlongo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9512280665089","Nonthando Hyalinthia","Hlongwa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["8309251049083","Thembi Goodness","Khumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9510120541080","Fundiswa Immaculate","Ndlovu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0403285140089","Bongani Sandile","Mgenge","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0503185320085","Senamile","Mpanza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0505140663087","Thandeka","Sokhulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9307130708084","Letha Zoliswa","Ngcobo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9602250760083","Nokuthula","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["8409300770083","Nonhlanhla","Zulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0512061041087","Asavela Praisegod","Nyosana","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9207216144081","Sbusiso Menzi","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["0409085469081","Sandisile","Xulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["8801305855085","Aubrey Mduduzi","Khumalo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0001125610087","Mbuso","Dube","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["7501110343084","Phumzile Jessie","Mkhize","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["7301026901087","Dumisani","Xulu","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8904200684087","Mercy","Gebani","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9906096152086","Sbusiso Phelele","Ntenga","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0209250735088","Sinalo","Gumede","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0106130617082","Hloniphile Snabo Brightness","Ndimande","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9405200394080","Zanele Andile","Ngwenya","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9511260616088","Thabile Sihle","Masinga","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0507070941087","Andiswa Sanelisiwe","Qwaku","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0404220440089","Anele Nonhlanhla","Congolo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0109080809089","Bongiwe","Nombexeza","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["8104020017085","Sindisiwe Fortunate","Makhathini","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9911091251081","Wandile Siphosethu","Langa","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9501231086081","Nolwazi Portia","Dube","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8905250956085","Prudence","Thabethe","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9303190483080","Nokuthula Grace","Makhathini","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0403095936080","Lungelo Kwanele","Ndima","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0505150118089","Zandile Princess","Mkhungo","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0306125984089","Thabiso Nkosingiphile","Zikhali","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9307150317089","Mbalenhle Rosemary","Ntuli","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9607091081086","Nompumelelo Ntobeko","Jali","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0308315438082","Sibonelo","Kunene","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9209015564089","Mthokozisi","Zwane","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9906166219088","Mthobisi","Mpanza","2025-11-03","Other","Enterprise Ilembe Holdings Pty Ltd","Payroll"],
["0401271119083","Nqubeko","Ngcobo","2025-11-03","Other","Enterprise Ilembe Holdings Pty Ltd","Nqubeko Admin"],
["9512050875082","Khwezilokusa","Nzimande","2025-11-03","M&E administrator","Enterprise Ilembe Holdings Pty Ltd","Project Office"],
["0009011516086","Mitchel","Moyo","2025-11-03","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Project Office"],
["8202030296085","Thina","Ndlovu","2025-11-03","Other","Enterprise Ilembe Holdings Pty Ltd","ADMIN TINA NDLOVU"],
["9802201002086","Welile Angel","Shezi","2025-11-20","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaMaphumulo 01"],
["9405090993082","Nompumelelo Happiness","Majozi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9211240446082","Thobekile Rozenne","Luthuli","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0207251222080","Silindile","Gumede","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0702071598081","Amahle Busisiwe","Khumalo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0010055405087","Ntsikelelo","Mpanza","2025-11-07","M&E administrator","Enterprise Ilembe Holdings Pty Ltd","Ntsikelelo"],
["0206080775086","Inamandla Precious","Mtengu","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["7601012436083","Thuleleni","Bhila","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["7709091480086","Nomvuyiswa","Ndamase","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8603170388089","Thobile","Ngubeni","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["7211201127087","Novelile","Nkosana","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["7307090651086","Nokuthula","Mthembu","2025-11-20","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["0201290417082","Nqobile","Majola","2025-11-11","M&E administrator","Enterprise Ilembe Holdings Pty Ltd","Nqobile"],
["9608056260087","Mxolisi","Ndlela","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["8707235885086","Thando","Mbokazi","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9609245913081","Siyanda Noel","Ndlovu","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0401041355082","Ntombenhle","Khoza","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9805015337085","Sibusiso Sibongiseni","Mathonsi","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8904110453086","Nokuthula","Dube","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["8508150476087","Silondile","Ntetha","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9201140831087","Zamajola","Majali","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9607301012087","Siphelele","Khoza","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["7906030607080","Thabisile Magaret","Ndlazi","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9509080820088","Nomfundo Brighten","Nzuza","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0110021002081","Sinenhlanhla Asanda Mbali","Gumede","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["8509101534081","Nonjabulo Millicent","Khanyile","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8206261532084","Zama Angelina","Ngcobo","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8806201641083","Simangele","Biyela","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9906300622080","Nomcebo","Mthethwa","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0305060389080","Nolwazi","Manqele","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9401275971084","Mpendulo Alex","Zwane","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9007010388086","Mbali","Langeni","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["8806091352080","Princess","Ndlovu","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9101260718082","Zandile","Myeza","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["7306100703085","Sibongile Princess","Mtshali","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["0101011768088","Nqobile","Gumede","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0209265727088","Londani","Duze","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9305185643081","Thulani Jacob Nhlakanipho","Nxele","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9403180416080","Gugu Promise","Dlamini","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9706165455083","Mondli","Nyawo","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["0612301433084","Nokubongwa Akhona","Magagula","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9205310517087","Nokukhanya Jannet","Ntombela","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9712030681085","Nokwanda","Ndlovu","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0110131073089","Lindiwe","Maphanga","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["8905165252083","Sicelo Patrick","Msomi","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9101055371089","Brian Ntuthuko","Ndebele","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9710270753085","Bonisiwe","Dlomo","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0606011176082","Andile","Mawela","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["8704085379088","Sanele","Buthelezi","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9511045626089","Mthobisi","Shange","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0007265932082","Lungelo","Masiya","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9506135513080","Lindokuhle Nkosikhona","Ngiba","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["9911035917086","Simphiwo","Nomkruca","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0208150750080","Sphelele","Mpanza","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0105270766089","Emihle","Cutsha","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0501205481085","Minenhle","Nzama","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9303161227086","Lindela Mbali","Gumede","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["8006140863084","Thandeka Precious","Zikhali","2025-11-20","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["8409175555080","Smanga Welcome","Dlamini","2025-11-11","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Project Office"],
["8801012583087","Thandeka Sisi","Ngcobo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9506021347080","Nomfundo Thembeka","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["9309155576081","Nkululeko Henry","Kunene","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["7903235462080","Sipho Bonginkosi","Khuzwayo","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["9104021427084","Londiwe Brightness","Buthelezi","2025-11-07","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 03"],
["9802035326081","Ayanda Thobani","Khumalo","2025-12-01","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0206175706087","Ayanda","Dlamini","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 05"],
["9511280863082","Nothando","Yengwa","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["9802145702080","Mukelani","Nlovu","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0312180556085","Snothando","Ndebele","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 01"],
["0009111136082","Sinothando","Chamane","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 03"],
["0002130967082","Nomvula","Mdletshe","2025-12-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0112100525081","Elize","Chiconela","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 01"],
["7704150748085","Samkelisiwe","Sibeko","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9009140484082","Gugulethu","Mdanda","2025-12-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9512101149081","Mbalenhle Nontando","Msweli","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Mandeni 03"],
["0210140514089","Andiswa","Hlengwa","2025-11-03","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["0009170881081","Bhengu","Snelile","2025-11-03","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9308295909087","Minenhle","Ngonyama","2025-11-03","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9306020393080","Nokwanda Precious","Ngcobo","2025-11-03","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 02"],
["9904070271089","Samkelisiwe","Dlamini","2025-11-03","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9412225649084","Jabulani","Ngema","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Maphumulo 02"],
["9909135254087","Musawenkosi Amahle","Dlamini","2025-11-03","District Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","DISTRICT COD AMAHLE DLAMINI"],
["8112190459086","Noluthando","Soga","2025-11-03","District Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Queen Soga"],
["9711040951082","Silindile","Masuku","2025-11-03","M&E administrator","Enterprise Ilembe Holdings Pty Ltd","Silindile Masuku"],
["0112280709083","Ayanda","Nonzanga","2025-11-03","Thematic Co-Ordinator","Enterprise Ilembe Holdings Pty Ltd","Project Office"],
["9409100842081","Kwanelisiwe","Khubisa","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["8803085766086","Senzosenkosi Sydney","Dlamini","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["8807135745081","Sandile Pius","Ngwane","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["9511260401085","Phumelele Rhodesia","Sibisi","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 01"],
["0504031103089","Amahle","Khuzwayo","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwendwe 04"],
["0207215688087","Mfanelo","Ntaka","2025-11-10","Ordinary Participant (half day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 02"],
["0103285922086","Nqubeko","Luthuli","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","KwaDukuza 04"],
["9203110483089","Thandeka","Magubane","2025-11-10","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 04"],
["0212280371080","Thembelihle","Nsele","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 04"],
["8712080823083","Ntombenhle","Ntshangase","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 04"],
["8510256298084","Ayanda","Ndimande","2025-11-17","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 04"],
["9909110495085","Philisiwe","Ngcobo","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 04"],
["0008280776082","Sinenhlanhla","Ngcobo","2025-11-11","Ordinary participant (full day)","Enterprise Ilembe Holdings Pty Ltd","Ndwedwe 01"],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function mapMunicipality(locality) {
  const l = (locality || '').toLowerCase();
  if (l.includes('kwadukuza') || l.includes('dukuza')) return 'KwaDukuza';
  if (l.includes('mandeni')) return 'Mandeni';
  if (l.includes('ndwedwe') || l.includes('ndwendwe')) return 'Ndwedwe';
  if (l.includes('maphumulo') || l.includes('kwamaphumulo')) return 'Maphumulo';
  return 'KwaDukuza';
}

function mapRoleLabel(wageLabel) {
  const l = (wageLabel || '').toLowerCase();
  if (l.includes('district co-ordinator') || l.includes('district coordinator')) return 'District Co-Ordinator';
  if (l.includes('thematic co-ordinator') || l.includes('thematic coordinator')) return 'Thematic Co-Ordinator';
  if (l.includes('field supervisor')) return 'Field Supervisor';
  if (l.includes('m&e')) return 'M&E Administrator';
  if (l.includes('ordinary participant')) return 'Participant';
  return 'Other';
}

function roleColor(role) {
  if (role === 'Field Supervisor') return 'bg-blue-500/20 text-blue-300';
  if (role === 'District Co-Ordinator') return 'bg-purple-500/20 text-purple-300';
  if (role === 'Thematic Co-Ordinator') return 'bg-amber-500/20 text-amber-300';
  if (role === 'M&E Administrator') return 'bg-pink-500/20 text-pink-300';
  if (role === 'Other') return 'bg-slate-600/20 text-slate-400';
  return 'bg-slate-500/20 text-slate-300';
}

// Parse raw array into participant objects
const PARTICIPANTS = RAW_PARTICIPANTS.map(row => ({
  idnumber: String(row[0]).trim(),
  firstname: String(row[1]).trim(),
  surname: String(row[2]).trim(),
  contractStartDate: row[3],
  currentWageLabel: row[4],
  currentSiteName: row[5],
  currentLocalityName: row[6],
  full_name: `${String(row[1]).trim()} ${String(row[2]).trim()}`,
  role: mapRoleLabel(row[4]),
  municipality: mapMunicipality(row[6]),
}));

const BATCH_SIZE = 30;

// ─── Additional file upload parser ───────────────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += ch; }
  }
  result.push(current.trim());
  return result;
}

function parseUploadedParticipants(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  // Find header row
  const headerIdx = lines.findIndex(l => l.toLowerCase().includes('idnumber') || l.toLowerCase().includes('id number'));
  if (headerIdx === -1) return null;
  const headers = parseCSVLine(lines[headerIdx]).map(h => h.toLowerCase().replace(/\s/g,''));
  const data = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (!cols[0] || cols[0].length < 5) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = (cols[idx] || '').trim(); });
    const idnum = row['idnumber'] || row['id'] || cols[0];
    const fname = row['firstname'] || row['first_name'] || cols[1] || '';
    const sname = row['surname'] || cols[2] || '';
    const start = row['contractstartdate'] || row['startdate'] || cols[3] || '';
    const wage = row['currentwagelabel'] || row['role'] || cols[4] || 'Ordinary participant (full day)';
    const site = row['currentsitename'] || cols[5] || '';
    const locality = row['currentlocalityname'] || cols[6] || '';
    if (!idnum || !sname) continue;
    data.push({
      idnumber: idnum, firstname: fname, surname: sname,
      contractStartDate: start, currentWageLabel: wage,
      currentSiteName: site, currentLocalityName: locality,
      full_name: `${fname} ${sname}`.trim(),
      role: mapRoleLabel(wage),
      municipality: mapMunicipality(locality),
    });
  }
  return data;
}

export default function ImportParticipants() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [filter, setFilter] = useState('all');

  // Additional file upload state
  const [uploadedData, setUploadedData] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadImporting, setUploadImporting] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const filtered = filter === 'all' ? PARTICIPANTS : PARTICIPANTS.filter(p => p.role === filter);
  const roleCounts = PARTICIPANTS.reduce((acc, p) => { acc[p.role] = (acc[p.role] || 0) + 1; return acc; }, {});

  async function handleImport(list, setImp, setProg, setRes) {
    setImp(true);
    setProg(0);
    let created = 0, failed = 0;
    const errors = [];
    for (let i = 0; i < list.length; i += BATCH_SIZE) {
      const batch = list.slice(i, i + BATCH_SIZE).map(p => ({
        idnumber: p.idnumber,
        firstname: p.firstname,
        surname: p.surname,
        contractStartDate: p.contractStartDate,
        currentWageLabel: p.currentWageLabel,
        currentSiteName: p.currentSiteName,
        currentLocalityName: p.currentLocalityName,
        status: 'active',
        workstream_name: 'ILEMBE',
      }));
      try {
        await base44.entities.Participant.bulkCreate(batch);
        created += batch.length;
      } catch (err) {
        errors.push(err.message);
        failed += batch.length;
      }
      setProg(Math.round(((i + BATCH_SIZE) / list.length) * 100));
    }
    setRes({ created, failed, errors });
    setImp(false);
    if (created > 0) toast.success(`Successfully imported ${created} participants!`);
  }

  function handleFileChange(e) {
    setUploadError('');
    setUploadedData(null);
    setUploadResults(null);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const parsed = parseUploadedParticipants(text);
      if (!parsed || parsed.length === 0) {
        setUploadError('Could not parse file. Make sure it is a CSV with columns: idnumber, firstname, surname, contractStartDate, currentWageLabel, currentSiteName, currentLocalityName');
      } else {
        setUploadedData(parsed);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 pb-24 lg:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link to={createPageUrl('HRDashboard')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Import Participants</h1>
            <p className="text-slate-400 text-sm">YMS × SEF – Enterprise iLembe – {PARTICIPANTS.length} participants loaded</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: PARTICIPANTS.length, color: 'text-white' },
            { label: 'Participants', value: roleCounts['Participant'] || 0, color: 'text-slate-300' },
            { label: 'Field Supervisors', value: roleCounts['Field Supervisor'] || 0, color: 'text-blue-300' },
            { label: 'Coordinators', value: (roleCounts['District Co-Ordinator'] || 0) + (roleCounts['Thematic Co-Ordinator'] || 0), color: 'text-purple-300' },
          ].map(s => (
            <Card key={s.label} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Base Import */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 mb-6">
          <CardContent className="p-6">
            {!results && !importing && (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <FileSpreadsheet className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">ILEMBERAW.xlsx</p>
                    <p className="text-slate-400 text-sm">{PARTICIPANTS.length} participants ready to import into Participant entity</p>
                  </div>
                </div>
                <Button onClick={() => handleImport(PARTICIPANTS, setImporting, setProgress, setResults)} disabled={user?.role !== 'admin'} className="bg-cyan-600 hover:bg-cyan-700 gap-2 px-8">
                  <Upload className="w-4 h-4" /> Import All {PARTICIPANTS.length}
                </Button>
              </div>
            )}
            {importing && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  <p className="text-white font-semibold">Importing... {Math.min(progress, 100)}%</p>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-cyan-500 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            )}
            {results && (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <CheckCircle className="w-10 h-10 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-emerald-400 font-semibold text-lg">Import Complete</p>
                  <p className="text-slate-300"><span className="text-white font-bold">{results.created}</span> imported{results.failed > 0 && <span className="text-red-400 ml-2">{results.failed} failed</span>}</p>
                </div>
                <Button onClick={() => navigate(createPageUrl('Participants'))} className="bg-emerald-600 hover:bg-emerald-700">View Participants</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Additional Import Section ── */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-cyan-500/20 mb-6">
          <CardHeader className="border-b border-slate-700/50 pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Plus className="w-4 h-4 text-cyan-400" />
              Import Additional Participants
              <span className="text-slate-500 text-xs font-normal ml-1">Upload a CSV file to add more participants</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm mb-4">
              Upload a <span className="text-slate-300 font-medium">CSV file</span> with columns: <code className="bg-slate-800 px-1 rounded text-cyan-300 text-xs">idnumber, firstname, surname, contractStartDate, currentWageLabel, currentSiteName, currentLocalityName</code>
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileChange} className="hidden" />
                <Button variant="outline" onClick={() => fileRef.current.click()} className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2">
                  <FileSpreadsheet className="w-4 h-4" /> Choose CSV File
                </Button>
                {uploadError && (
                  <div className="mt-3 flex items-start gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {uploadError}
                  </div>
                )}
                {uploadedData && !uploadResults && (
                  <div className="mt-3 bg-emerald-500/10 rounded-lg p-3 text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Parsed <span className="font-bold">{uploadedData.length}</span> participants from file. Ready to import.
                  </div>
                )}
                {uploadResults && (
                  <div className="mt-3 text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> <span className="font-bold">{uploadResults.created}</span> imported successfully.
                    {uploadResults.failed > 0 && <span className="text-red-400 ml-1">{uploadResults.failed} failed.</span>}
                  </div>
                )}
              </div>
              {uploadedData && !uploadResults && (
                <Button
                  onClick={() => handleImport(uploadedData, setUploadImporting, () => {}, setUploadResults)}
                  disabled={uploadImporting || user?.role !== 'admin'}
                  className="bg-cyan-600 hover:bg-cyan-700 gap-2"
                >
                  {uploadImporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</> : <><Upload className="w-4 h-4" /> Import {uploadedData.length} Records</>}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Table */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Participant List Preview
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {['all', 'Participant', 'Field Supervisor', 'District Co-Ordinator', 'Thematic Co-Ordinator', 'M&E Administrator'].map(r => (
                  <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === r ? 'bg-cyan-600 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}>
                    {r === 'all' ? `All (${PARTICIPANTS.length})` : `${r} (${roleCounts[r] || 0})`}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-900">
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 py-3 px-4">#</th>
                    <th className="text-left text-slate-400 py-3 px-4">Name</th>
                    <th className="text-left text-slate-400 py-3 px-4">ID Number</th>
                    <th className="text-left text-slate-400 py-3 px-4">Role</th>
                    <th className="text-left text-slate-400 py-3 px-4">Municipality</th>
                    <th className="text-left text-slate-400 py-3 px-4">Locality</th>
                    <th className="text-left text-slate-400 py-3 px-4">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => (
                    <tr key={p.idnumber + idx} className={`border-b border-slate-800 ${idx % 2 === 0 ? '' : 'bg-slate-900/30'}`}>
                      <td className="text-slate-600 py-2.5 px-4 text-xs">{idx + 1}</td>
                      <td className="text-white py-2.5 px-4 font-medium">{p.full_name}</td>
                      <td className="text-slate-400 py-2.5 px-4 font-mono text-xs">{p.idnumber}</td>
                      <td className="py-2.5 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor(p.role)}`}>{p.role}</span></td>
                      <td className="text-slate-300 py-2.5 px-4">{p.municipality}</td>
                      <td className="text-slate-400 py-2.5 px-4 text-xs">{p.currentLocalityName}</td>
                      <td className="text-slate-400 py-2.5 px-4 text-xs">{p.contractStartDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-700 text-center text-slate-500 text-sm">
              Showing {filtered.length} of {PARTICIPANTS.length} participants
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">AfriEconomy Tech™ · Powered by Kwahlelwa Group</p>
        </div>
      </div>
    </div>
  );
}